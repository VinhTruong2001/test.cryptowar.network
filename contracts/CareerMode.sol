pragma solidity ^0.6.0;

import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "abdk-libraries-solidity/ABDKMath64x64.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "abdk-libraries-solidity/ABDKMath64x64.sol";
import "./interfaces/IStakeFromGame.sol";
import "./interfaces/IRandoms.sol";

import "./characters.sol";
import "./weapons.sol";

contract CareerMode is
    IERC721ReceiverUpgradeable,
    Initializable,
    AccessControlUpgradeable
{
    using ABDKMath64x64 for int128;
    using SafeMath for uint256;
    using SafeMath for uint64;

    bytes4 private constant _INTERFACE_ID_ERC721 = 0x80ac58cd;
    bytes32 public constant GAME_ADMIN = keccak256("GAME_ADMIN");

    Characters public characters;
    Weapons public weapons;
    IERC20 public xBlade;
    IRandoms public randoms;

    struct Room {
        address owner;
        uint256 matchReward;
        uint256 totalDeposit;
        uint256 weaponId;
        uint256 characterId;
        bool claimed;
        uint256 maxLevelFight;
    }

    Room[] careerModeRooms;

    mapping(address => uint256) tokenRewards;
    uint256 rewardClaimTax;
    uint8 durabilityCostFight;
    uint8 staminaCostFight;

    mapping(uint256 => uint256) roomTimerStart;
    uint256 minimumRoundDuration;

    /** EVENTS */

    event CreateCareerRoom(
        address owner,
        uint256 matchReward,
        uint256 totalDeposit,
        uint256 weaponId,
        uint256 characterId
    );

    event FightOutCome(
        address opponent,
        address roomOwner,
        uint256 char,
        uint256 wep,
        uint256 opponentRoll,
        uint256 ownerRoll,
        uint256 opponentIncome
    );

    event ClaimReward(uint256 reward);

    event EndCareerRoom(uint256 id, address owner, uint256 withdrawAmount);

    function initialize(
        IERC20 _xBlade,
        Characters _characters,
        Weapons _weapons,
        IRandoms _randoms
    ) public initializer {
        __AccessControl_init();

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(GAME_ADMIN, msg.sender);

        xBlade = _xBlade;
        characters = _characters;
        weapons = _weapons;
        randoms = _randoms;

        rewardClaimTax = 10; // 10%
        staminaCostFight = 40;
        durabilityCostFight = 3;
        minimumRoundDuration = 2 days;
    }

    /** MODIFIERS */

    modifier restricted() {
        _restricted();
        _;
    }

    function _restricted() internal view {
        require(hasRole(GAME_ADMIN, msg.sender), "NGA");
    }

    modifier isWeaponOwner(uint256 weapon) {
        _isWeaponOwner(weapon);
        _;
    }

    function _isWeaponOwner(uint256 weapon) internal view {
        require(weapons.ownerOf(weapon) == msg.sender, "Not WPO");
    }

    modifier isWeaponsOwner(uint256[] memory weaponArray) {
        _isWeaponsOwner(weaponArray);
        _;
    }

    function _isWeaponsOwner(uint256[] memory weaponArray) internal view {
        for (uint256 i = 0; i < weaponArray.length; i++) {
            require(weapons.ownerOf(weaponArray[i]) == msg.sender, "Not WPO");
        }
    }

    modifier isCharacterOwner(uint256 character) {
        _isCharacterOwner(character);
        _;
    }

    function _isCharacterOwner(uint256 character) internal view {
        require(characters.ownerOf(character) == msg.sender, "Not CHO");
    }

    /** MUTATIVES */

    function onERC721Received(
        address, /* operator */
        address, /* from */
        uint256,
        bytes calldata /* data */
    ) external override returns (bytes4) {
        return IERC721ReceiverUpgradeable.onERC721Received.selector;
    }

    function createRoom(
        uint256 _char,
        uint256 _wep,
        uint256 _matchReward,
        uint256 _totalDeposit,
        uint256 _maxLevel
    ) public isWeaponOwner(_wep) isCharacterOwner(_char) {
        require(
            _totalDeposit > _matchReward,
            "Match reward mod total deposit must be 0"
        );
        require(xBlade.balanceOf(msg.sender) > _totalDeposit);

        xBlade.transferFrom(msg.sender, address(this), _totalDeposit);
        IERC721(address(characters)).safeTransferFrom(
            msg.sender,
            address(this),
            _char
        );
        IERC721(address(weapons)).safeTransferFrom(
            msg.sender,
            address(this),
            _wep
        );
        roomTimerStart[careerModeRooms.length] = block.timestamp;
        careerModeRooms.push(
            Room(
                msg.sender,
                _matchReward,
                _totalDeposit,
                _wep,
                _char,
                false,
                _maxLevel
            )
        );
        emit CreateCareerRoom(
            msg.sender,
            _matchReward,
            _totalDeposit,
            _wep,
            _char
        );
    }

    function fight(
        uint256 _roomId,
        uint256 _wep,
        uint256 _char
    ) public isWeaponOwner(_wep) isCharacterOwner(_char) {
        require(canFight(_roomId), "Cannot fight");
        Room memory r = careerModeRooms[_roomId];
        require(
            characters.getLevel(_char) <= r.maxLevelFight,
            "Your level is higher than max level room"
        );

        require(
            xBlade.balanceOf(msg.sender) > r.matchReward,
            "Not enough xBlade to fight"
        );
        require(msg.sender != r.owner, "Cannot fight your self");
        require(r.totalDeposit >= r.matchReward, "This career room is ended");

        performFight(
            _roomId,
            _char,
            _wep,
            getPlayerPower(r.characterId, r.weaponId),
            getPlayerPower(_char, _wep)
        );
    }

    function performFight(
        uint256 _roomId,
        uint256 _char,
        uint256 _wep,
        uint24 _playerPower,
        uint24 _opponentPower
    ) internal {
        uint256 seed = randoms.getRandomSeed(msg.sender);

        uint24 playerRoll = getPlayerPowerRoll(_playerPower, seed);
        uint24 opponentRoll = getPlayerPowerRoll(_opponentPower, seed);
        Room storage r = careerModeRooms[_roomId];

        uint256 tokensWin = r.matchReward;
        r.totalDeposit = r.totalDeposit.sub(r.matchReward);

        if (opponentRoll <= playerRoll) {
            tokensWin = 0;
            r.totalDeposit = r.totalDeposit.add(r.matchReward.mul(2));
            xBlade.transferFrom(msg.sender, address(this), r.matchReward);
        }

        tokenRewards[msg.sender] += tokensWin;
        emit FightOutCome(
            msg.sender,
            r.owner,
            _char,
            _wep,
            opponentRoll,
            playerRoll,
            tokensWin
        );
    }

    function claimTokenRewards() public {
        require(tokenRewards[msg.sender] > 0, "No reward");

        uint256 _tokenRewards = tokenRewards[msg.sender];
        tokenRewards[msg.sender] = 0;

        uint256 _tokenRewardsToPayOut = _tokenRewards.sub(
            _tokenRewards.mul(rewardClaimTax).div(100)
        );

        xBlade.transfer(msg.sender, _tokenRewardsToPayOut);
        emit ClaimReward(_tokenRewardsToPayOut);
    }

    function endCareer(uint256 id) public {
        require(
            block.timestamp >= roomTimerStart[id].add(minimumRoundDuration),
            "Cannot end career"
        );
        Room storage r = careerModeRooms[id];

        require(msg.sender == r.owner, "Must be owner");

        r.claimed = true;
        uint256 fee = r.totalDeposit.mul(rewardClaimTax).div(100);
        uint256 reward = r.totalDeposit.sub(fee);

        if (reward > 0) {
            xBlade.transfer(r.owner, reward);
        }
        r.totalDeposit = 0;

        IERC721(address(characters)).safeTransferFrom(
            address(this),
            r.owner,
            r.characterId
        );
        IERC721(address(weapons)).safeTransferFrom(
            address(this),
            r.owner,
            r.weaponId
        );
        emit EndCareerRoom(id, r.owner, reward);
    }

    /** GETTERS */

    function unpackFightData(uint96 playerData)
        public
        pure
        returns (
            uint8 charTrait,
            uint24 basePowerLevel,
            uint64 timestamp
        )
    {
        charTrait = uint8(playerData & 0xFF);
        basePowerLevel = uint24((playerData >> 8) & 0xFFFFFF);
        timestamp = uint64((playerData >> 32) & 0xFFFFFFFFFFFFFFFF);
    }

    function getPlayerPower(uint256 char, uint256 wep) public returns (uint24) {
        (uint8 charTrait, uint24 basePower, ) = unpackFightData(
            characters.getFightDataAndDrainStamina(char, staminaCostFight)
        );

        (
            int128 weaponMultTarget,
            int128 weaponMultiplier,
            uint24 weaponBonusPower,
            uint8 weaponTrait
        ) = weapons.getFightDataAndDrainDurability(
                wep,
                charTrait,
                durabilityCostFight
            );
        return uint24(weaponMultiplier.mulu(basePower).add(weaponBonusPower));
    }

    function getPlayerPowerRoll(uint24 playerFightPower, uint256 seed)
        internal
        pure
        returns (uint24)
    {
        return uint24(plusMinus10PercentSeeded(playerFightPower, seed));
    }

    function getRoom(uint256 _id)
        public
        view
        returns (
            address owner,
            uint256 matchReward,
            uint256 totalDeposit,
            uint256 weaponId,
            uint256 characterId
        )
    {
        Room memory r = careerModeRooms[_id];
        return (
            r.owner,
            r.matchReward,
            r.totalDeposit,
            r.weaponId,
            r.characterId
        );
    }

    function randomSeededMinMax(
        uint256 min,
        uint256 max,
        uint256 seed
    ) internal pure returns (uint256) {
        // inclusive,inclusive (don't use absolute min and max values of uint256)
        // deterministic based on seed provided
        uint256 diff = max.sub(min).add(1);
        uint256 randomVar = uint256(keccak256(abi.encodePacked(seed))).mod(
            diff
        );
        randomVar = randomVar.add(min);
        return randomVar;
    }

    function plusMinus10PercentSeeded(uint256 num, uint256 seed)
        internal
        pure
        returns (uint256)
    {
        uint256 tenPercent = num.div(10);
        return
            num.sub(tenPercent).add(
                randomSeededMinMax(0, tenPercent.mul(2), seed)
            );
    }

    function getReward(address account) public view returns (uint256) {
        return tokenRewards[account];
    }

    function canFight(uint256 id) public view returns (bool) {
        Room memory r = careerModeRooms[id];
        return r.totalDeposit > 0 && !r.claimed;
    }

    function totalRooms() public view returns (uint256) {
        return careerModeRooms.length;
    }

    function getStartTime(uint256 id) public view returns (uint256) {
        return roomTimerStart[id];
    }
}
