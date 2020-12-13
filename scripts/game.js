//игровые объекты
objects = [
	{img: "house.png", x: 300, y: 300, solid: true},
	{img: "house.png", x: 800, y: 300, solid: true},
	{img: "house.png", x: 750, y: 500, solid: true},
	{img: "house.png", x: 300, y: 900, solid: true},
	{img: "kust.png", x: 150, y: 100, solid: false}
];

//НПС
NPC = [
	{img: "mag.png", x: 250, y: 250, solid: true, cadr: 1, slide: 4},
	{img: "boy.png", x: 700, y: 300, solid: true, cadr: 1, slide: 4},
	{img: "woman.gif", x: 300, y: 250, solid: true, cadr: 1, slide: 4},
	{img: "player.png", x: 600, y: 400, solid: true, cadr: 1, slide: 3}
];

//предметы
Items = [
	{name: "Ball", img:"Ball.png", x: 100, y: 100},
	{name: "Rick", img: "PiclRick.png", x: 550, y: 700, potion: "HP", point: 5},
	{name: "MP_Potion", img: "MP_Potion.png", x: 700, y: 700, potion: "MP", point: 10}
]

//мобы
Mobs = [
	{img: "red.png", name: "red", x: 400, y: 800, patrol: false, slide: 4, HP: 10, DM: 5, PR: 1, xp: 10, gld: 11}
]

//отряд мобов (для target системы)
Party=[
	["bg.jpg", 1, 1, 1, 1]
]

//параметры
razmer=40;
BG_Speed=3;
BG_X=100; BG_Y=300;
BG_Rec=50;
BG_Map_X=60; BG_Map_Y=90;
BG_Player_Slide=4;
BG_Protect=4
BG_DM=4;
heals=10;
mana=10;
invx=6;
invy=6;
Atacks=[
	{img: "kulak.png", dmg: 2, mana: 0, name: "fist"},
	{img: "leg.png", dmg: 4, mana: 2, name: "kick"}
]
Skills=[
	{img: "support.png", name: "treatment", class: "HP", point: 5, MP: 2},
	{img: "vampir.png", name: "vampire", class: "VP", point: 4, MP: 3},
	{img: "double.png", name: "damage x2", class: "DD", point: 2, MP: 4},
	{img: "dragon.png", name: "flame", class: "SK", DM: 4, MP: 4},
	{img: "git.png", name: "big damag", class: "SK", DM: 6, MP:4}
]

//текстуры
grass.src = './texture/Grass.jpg'
player.src= './texture/baby.png'
MFon.src='./texture/fon.jpg'
TargetGUI.src='./texture/target.png'

//не нажата
BGame.src = './texture/gameO.png'
BInventory.src = './texture/inventotyO.png'
BAbout.src = './texture/aboutO.png'
BExit.src = './texture/exitO.png'
Button.src = './texture/button.png'

//нажата
BGameN.src = './texture/gameN.png'
BInventoryN.src = './texture/inventotyN.png'
BAboutN.src = './texture/aboutN.png'
BExitN.src = './texture/exitN.png'
ButtonN.src = './texture/buttonN.png'

//GUI
Dialog.src = './texture/dialog.png'

//текст
DText = [
	["Mage","text", "text2", "text3", "text4","?"],
	["Johny","I'm a boy!", "?","BOY!!!"],
	["woman", "...", "?","...", "?N"],
	["Blue girl", "Hi! Can you help me?", "?", "I lost my ball", "Can you bring me my ball?", "?Q", "?F", 
	"Thanks you, my hero!", "Please, take this.", "?N"]
]

targetTXT=[
	"atack", "skill", "bag", "run"
]

//ответы
DAnsver = [
	["Ansver 1", "Ansver 2", "Ansver 3"],
	["Ok", "But, I thought you are a girl"],
	["Hi?"],
	["What happened?"]
]

QAnsver = ["Yes", "No"]

//квесты
Quests = [
	[],
	[],
	[],
	["item", "Ball", 1, 10, 11]
]

//вызов функции BG_RPG с интервалом 10
setInterval(BG_RPG, 10);