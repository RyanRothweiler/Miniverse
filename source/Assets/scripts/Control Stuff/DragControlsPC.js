/*
Change Log:

June 25 - Devon
Removed selectedWorld.transform.position.z = WorldZDepth because I changed 1 other line of code to fix dragging
Dragging now uses the ScreenToWorldPoint argument thingy to determine the mouse position and where the world
needs to be based on the screen position.
Ran into a small issue with the world jumping back on the Z axis but I quickly figured out that it was just because
the world's z depth was also getting the camera's z depth added to it because of the change in how we determine the
world's position.


July 5 - Ryan
commented out gui and level loading

July 19 - Ryan
commented out devons depth check array.

July 22 - Ryan
Cleaned everything up and removed all unecessary comments.
Started work on clicking to move people to closest planet

July 23 - Ryan
Added zoomspeed to control.. well.. the zoom speed when the players zooms in and out.
Removed lose condition and 'removal of dead people'
also started work on camera exiting. aka zooming in when the level is beat to load the next level. so instead of using fov the camera changes position
reorganzed variables aswell. :3

July 26 - Devon
Started work on sun radii shrinking
Finished? work on sun radii shrinking
^Still needs to shrink the radii, will fix after code thus far is proven to work
Started work on asteroids

Just a note on naming conventions
^Scripts will be capitals for first letters so DragControlsPC or PlanetSearcher
^Variables will be what they have been lowercase then uppercase selectLine objectInfo
^Preferably if we can keep actual objects and models and those real shit in all lowercase would be nice but those don't matter so much

Finished work on asteroids
Started work on people flying around a planet
Started work on people flying to planets

People Orbit planets too far away
People flying to planets will need a loop and it does some wierd shinanigans atm too...just moves into oblivion

July 27 - Ryan
removed CamFOVZoomSpeed. It was doing nothing.

July 29 - Ryan
removed SunDist. It was doing nothing.

August 2 - Ryan
FOR ALL INTENTS AND PURPOSES ICOPHERE means asteroid. Not literally.. but well... if you're confused just ask me. Its not easy to explain.

August 6 - Ryan
More fucking variable shit trying to get it to work on ios. #pragma strict will be the death of me.

August 20 - Devon
>Work finished on people Orbitting & people flying between planets 
>Fixed level win conditions and transition issues

>Started work on debris field functionality
>Starting work on touch controls

August 22 - Devon
>Can't say I fixed it, but some problem with dragging ended *shrug*
>Also, Idk what the fuck happened with all your shit but there were just a bunch of problems that I fixed up
Everything appears to be mostly in working order although I need to get people moving working again.
I think some of the problems stemmed from the fact you were parent EVERYTHING in the scene to the scene scale controller then when you detached it all it just created a ton of
separate objects. So I made it so that it doesn't make all those separate objects and keeps it in their respective heirachies. But
I had to change how you were creating the lists slightly so its back to the older way of doing it but I think it's
perfectly fine and it runs now so meh...
>Made the reparenting of people more efficient.
>Cleaned things up a bit
>Updating everything to .r53 as of today
*/


#pragma strict

//public vars
public var objectInfo : RaycastHit;
public var selectedWorld : RaycastHit;

public var peopleSaved = 0; //number of people saved
public var peopleGoal : int; //win condition of the level
public var peopleAlive : int; //People # Monitor
public var WorldZDepth : int; //depth of the plane which all interactable object sit on
public var CameraLocDepth : int; //the z depth which the camer sits on
public static var previousLevel = 0; //the level num which the player was in last

public var worldDist : float; //distance which the worlds must stay to the sun
public var DragRate : float; //speed which player moves the world around
public var CameraPositionSpeed : float; // the speed which the camera moves in during the level transitions
public var CameraScaleSpeed : float; //the speed which the world scales up and down in the level transitions 
public var LevelSelectDragRate : float; //rate at which the level select tags are drug 

public var WorldDraggingInverted : boolean; //if world dragging is inverted
public var CanMoveCameraHorizontal : boolean; //if the player can move the camera horizontally
public var TouchAutoMove : boolean; //if true then when a planet is touched, the camera will automatically move up until the end of the level
public var sunShrink : boolean;
public var AutoMoving = false;
public var isMenu : boolean;
public var isLevelSelect : boolean;
public var CanScrollZoom : boolean; //if the level can scrool zoom
public var LevelPaused : boolean; //if the level is paused. Only zoom controls work if the level is paused. 
public var CanViewDrag : boolean; //if the player can drag the view around
public var CameraViewPlanetPush : boolean; //if pushing a planet toward the edge of the screen then the camera moves
public var Transitioning = false; //if the level is in transition or not
public var LevelLost = false; //triggered by lose condition
public var FlyAway = false; //flying the spaceship away to the next level

public var Phase1 = false;
public var Phase2 = false;
public var Phase3 = false;

public var PlatformIOS = false;
public var PlatformPC = false;

public var ZoomSpeed = 25; //speed which player controls zoom
public var CamFOVStop = 39; //the field of vision to stop at when the camera is zooming in during the level intro transition

public var PlanetPushBuffer : Vector2; //the amount of give which to allow in planet view pushing
public var CameraZoomOutPos : Vector3; //the position the camera zooms out to 
//public var StarBackground : GameObject; // the star background
public var NebulaBackground : GameObject; // the background nebula
public var TransitionStars : GameObject; //the transition star plane
public var SceneScaleController : GameObject; // controls the scale of all notBackground objects in the scene.
public var PlanetExplosion : GameObject;
public var LevelSelectMovementController : GameObject; //the parent for all the level select objects
public var PeoplePoof : GameObject; //the PeoplePoof particle effect
public var PausePlane : GameObject; //the pause plane which will show when zoomed out
public var FailType : TextMesh; //the type which shows on level fail
public var StarStreakMat : Material;








//floats
private var rotationSpeed = 10.0;
private var lerpSpeed = 1.0;
private var f = 0.0;
private var startTime : float;

//ints
private var camZStopPos = -11;
private var n : int;
private var i : int;
private var x : int;
private var j : int;
private var num : int;
private var dummyNum : int;
public var xRate : int; //rate of movement in x axis (used for MoveTo())
public var yRate : int; //rate of movement in y axis
public var zRate : int; //rate of movement in z axis

//array
private var objects : GameObject[];
public var worldObjects : GameObject[];
private var sunObjects : GameObject[];
private var dummyChildList : Component[];
private var personObjects : GameObject[];

//booleans
private var peopleDragging : boolean;
var worldSelected : boolean;
private var isSelected : boolean;
private var canMove : boolean;
private var worldDragging : boolean;
private var close : boolean;
private var resetting : boolean;
private var nextLevel : boolean;
private var cont : boolean;
var halt : boolean; //Stops events in the level from running until the zoom sequence has finished.
static var isPlayOne : boolean; //Determines if the Camera should zoom in or not.
static var isOptions : boolean;
static var inGame : boolean;
static var fromLSelect : boolean;
private var buttonPushed = false;//if the back button was pushed
private var CanZoom = true; //if the level can level transition zoom
private var LevelFirst = true;
private var levelWon = false;
private var ZoomVirgin = true;

//Strings
private var Level : String;
private var str : String;

//other... things...
private var selectedPlanet : Transform;
private var mousePos : Vector3;
private var offSet : Vector3;
private var worldScreenPoint : Vector3;
var tinyWorldGUI : GUISkin; //The GUIskin for the UI elements
private var shrinkCode : ShrinkCode;
private var flyingPeople : FlyingPeople;
private var radiiBall : Transform;
private var child : GameObject; //a dummy child game object
public var cameraZoomInPos : Vector3; //the position the camera zooms into. aka the position the camera was at when it zoomed out
private var dummyVector3 : Vector3;
private var dummyVector2 : Vector2;
//private var PrevLevelNum : GameObject; //when moving back to the level select screen, this holds the level num of the level which the player came from
private static var PrevLevelLoc : Vector3; //the previous level tag's location
private var LevelOffset : Vector3; 
private var shipLoc : Vector3; //the location of the ship
private var Timer : LevelTimer; //the script which controls the level times

//touch control variables
public var Touch1StartPos = Vector2(0,0); //the start position of a touch
public var Touch1EndPos = Vector2(100,100); //the end position of a touch
private var Touch1Delta : Vector2; //delta of first touch
private var Touch1Tap = false; //if the touch is a tap
private var Touch1Move = false; //if the touch is a moving one
private var Movement1Delta : Vector2; //used for flicking
public var Touch1Start = true;
public var Touching1 = false;
public var Touch1WorldSelected = false;
public var Touch1CameraDragging = false;

public var Touch2StartPos = Vector2(0,0); //the start position of a touch
public var Touch2EndPos = Vector2(100,100); //the end position of a touch
private var Touch2Delta : Vector2; //delta of the second touch
private var Touch2Tap = false; //if the touch is a tap
private var Touch2Move = false; //if the touch is a moving one
private var Movement2Delta : Vector2; //used for flicking
private var Touch2Start = true;
public var Touching2 = false;
public var Touch2WorldSelected = false;
public var Touch2CameraDragging = false;

private var TouchTapBounds = Vector2(10,10); //the amount of movement to allow which stil constitutes a tap.
private var dummyVect : Vector3; //a dummy vector 2
private var MovementControllerOldPos : Vector2;
private var PinchIn = false;
private var PinchOut = false;

//Level Saving/Progress/Time Specific Vars
private static var sS : SaveStating;
private var bTime : int;

//camera zooming
function OnLevelWasLoaded()
{
	if(isPlayOne)
	{
		isPlayOne = false;
		nextLevel = false;
		//Camera.main.fieldOfView = 100;
		halt = true;
	}

}

function Start () 
{
	//initialize things
	peopleDragging = false;
	nextLevel = false;
	halt = true;
	cont = false;
	f = 0;
	LevelOffset = Vector3.zero;
	Timer = GetComponent(LevelTimer); //get the level timer
	shipLoc = GameObject.Find("humanShip").transform.position;
	
	//center scale controller
	SceneScaleController.transform.position = Vector3(this.transform.position.x, this.transform.position.y, SceneScaleController.transform.position.z);
	
	//create ss
	sS = new SaveStating();

	if(Application.loadedLevelName == "mainmenu")
	{
		isMenu = true;
	}
	else
	{
		isMenu = false;
	}
	
	//level select instant zoom
	if (isLevelSelect) {
		transform.position.z = camZStopPos;
	}
	
	objects = GameObject.FindObjectsOfType(GameObject);
	worldObjects = GameObject.FindGameObjectsWithTag("world");
	sunObjects = GameObject.FindGameObjectsWithTag("sun");
	personObjects = GameObject.FindGameObjectsWithTag("humanPerson");

	//This is kinda important, it keeps everything properly parented so this sorting step is necessary
	if (!isLevelSelect)
	{
		for (i = 0; i < objects.length; i++)
		{	
			//if tagged as a world
			if (objects[i].tag == "world")
				objects[i].transform.parent = SceneScaleController.transform;
			//if tagged as a sun
			if (objects[i].tag == "sun")
				objects[i].transform.parent = SceneScaleController.transform;
			//if tagged as ui
			if (objects[i].tag == "ui")
				objects[i].transform.parent = SceneScaleController.transform;
			//if an asteroid
			if (objects[i].name == "Asteroid")
				objects[i].transform.parent = SceneScaleController.transform;
			//red asteroids
	//		if (objects[i].name == "RedAsteroid")
	//			objects[i].transform.parent = SceneScaleController.transform;
		}
	}

	peopleGoal = personObjects.length;
	peopleAlive = personObjects.length;
	
	//scale down scene
	if (!isLevelSelect) {
		SceneScaleController.transform.localScale = Vector3(0,0,0);
	}
	
	//set platform and platform specific settings
	if (Application.platform == RuntimePlatform.IPhonePlayer)
	{
		print("IOS");
		DragRate = 0.02;
		WorldDraggingInverted = false;
		PlatformIOS = true;
		PlatformPC = false;
	}
	else
	{
//		print("IOS");
//		DragRate = 0.02;
//		WorldDraggingInverted = false;
//		PlatformIOS = true;
//		PlatformPC = false;
		print("PC");
		PlatformPC = true;
		PlatformIOS = false;
	}
	
}

//main update function
function Update ()
{
	//rest stuff
	Transitioning = false;
	
	//Use "M" key to save for computer, just for testing and this is the usage btw
	if(Input.GetButton("M"))
	{
		Debug.Log("Save");
		sS.xmlHandler.World = sS.xmlHandler.sWorld;
		sS.xmlHandler.Save(Path.Combine(Application.dataPath, "lProgress.xml"));
	}
	//Use "L" key to load for computer, just for testing and this is the usage btw
	if(Input.GetButton("L"))
	{
		print("Load");
		//Basically, what is loaded is an "XmlHandler" object that is then assigned to the one our game is using.
		sS.xmlHandler = sS.xmlHandler.Load(Path.Combine(Application.dataPath, "lProgress.xml"));
		for(var p : Level in sS.xmlHandler.World)
		{
			print("print you bitch");
			print(p.name);
			print(p.bTime);
			print(p.lProgress);
		}
		//Since our level select screen uses the static var sWorld to display completion info the static var must = the non-static one
		sS.xmlHandler.sWorld = sS.xmlHandler.World;
		
	}

	
	//main menu stuff
	if(isMenu)
	{
		MainMenu();
	}
	
	//level select stuff
	if(isLevelSelect)
	{
		LevelSelect();
		LevelSelectMovementController.transform.position = PrevLevelLoc + LevelOffset;
	}
	else
	{
		LevelFirst = true;
	}
		
//	if(isOptions)
//	{
//		Options();
//	}

	//autoMoving moving up
	if (AutoMoving)
	{
		AutoMovingStartPhases();
	}
	
	//check planet pushing
	if (CameraViewPlanetPush)
	{
		CameraViewPlanetPushing();
	}
	
	if(!halt)
	{
		if (PlatformPC)
		{
			//camera zooming
			//zooming out
			if(CanScrollZoom && !LevelPaused && Input.GetAxis("Mouse ScrollWheel") < 0)
			{
				StopAllCoroutines();
				MoveToWorldView();
			}
			//zooming in
			if (CanScrollZoom && LevelPaused && Input.GetAxis("Mouse ScrollWheel") > 0)
			{
				StopAllCoroutines();
				MoveToPlayView();
			}
			
			//world dragging shenanigans
			if (!LevelPaused && Input.GetMouseButtonDown(0) && !AutoMoving && !isLevelSelect)
			{			
				if (Physics.Raycast(Camera.main.WorldToScreenPoint(Vector3(Input.mousePosition.x,Input.mousePosition.y,Camera.main.transform.position.z)), Camera.main.ScreenToWorldPoint(Vector3(Input.mousePosition.x, Input.mousePosition.y, WorldZDepth - Camera.main.transform.position.z)), objectInfo))
				{
					//if the planet is draggable
					if (objectInfo.collider.gameObject.GetComponent(PlanetSearcher).Draggable)
					{
						worldSelected = true;
						selectedWorld = objectInfo;
						selectedWorld.collider.GetComponent(PlanetSearcher).Selected = true;
						offSet = selectedWorld.transform.position - Camera.main.ScreenToWorldPoint(Vector3(Input.mousePosition.x, Input.mousePosition.y,WorldZDepth - Camera.main.transform.position.z));
					}
				}
			}
			//if planet dragging
			if (!LevelPaused && Input.GetMouseButton(0) && worldSelected && selectedWorld.collider != null && selectedWorld.collider.name != "humanShip" && selectedWorld.collider.name != "Asteroid" && selectedWorld.collider.name != "Icosphere" && selectedWorld.transform.gameObject.name != "RedAsteroid")//&& !selectedWorld.collider.GetComponentInChildren(planetLifeIndicator).dead)
			{
				if (TouchAutoMove)
				{
					AutoMoveCheckPhases();
				}
				
				//if the planet is alive then move the planet
				if (selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).Alive)		
					selectedWorld.transform.position = Camera.main.ScreenToWorldPoint(Vector3(Input.mousePosition.x,Input.mousePosition.y,WorldZDepth - Camera.main.transform.position.z)) + offSet;
			}
			//if world dragging
			if ( (Input.GetAxis("Horizontal") || Input.GetAxis("Vertical")) && !LevelPaused && CanViewDrag)
			{
				if (CanMoveCameraHorizontal)
				{
					if (WorldDraggingInverted) {
						FailType.transform.parent = this.transform;
						this.transform.Translate(Vector3(Input.GetAxis("Horizontal") * DragRate, Input.GetAxis("Vertical") * DragRate, 0));
					}
					else {
						FailType.transform.parent = this.transform;
						this.transform.Translate(Vector3(Input.GetAxis("Horizontal") * DragRate * -1, Input.GetAxis("Vertical") * DragRate * -1, 0));
					}
				}
				else
				{
					if (WorldDraggingInverted) {
						FailType.transform.parent = this.transform;
						this.transform.Translate(0, Input.GetAxis("Vertical") * DragRate, 0);
					}
					else {
						FailType.transform.parent = this.transform;
						this.transform.Translate(0, Input.GetAxis("Vertical") * DragRate * -1, 0);
					}
				}
			}
			//if release mouse
			if (Input.GetMouseButtonUp(0) && !AutoMoving && !LevelPaused)
			{
				if(!TouchAutoMove)
				{
					if (!isLevelSelect && selectedWorld.collider != null)
					{
						selectedWorld.collider.GetComponent(PlanetSearcher).Selected = false;
					}
					worldSelected = false;//reset
				}
			}
			
			//check if the player clicks down mouse button on a planet
			if (Input.GetMouseButtonDown(0) && !LevelPaused)
			{
				mousePos = Input.mousePosition;
				if (Physics.Raycast(Camera.main.ScreenPointToRay(Vector3(Input.mousePosition.x, Input.mousePosition.y, WorldZDepth - Camera.main.transform.position.z)).origin, Camera.main.ScreenPointToRay(Vector3(Input.mousePosition.x, Input.mousePosition.y, WorldZDepth - Camera.main.transform.position.z)).direction, objectInfo))
				{
					selectedWorld = objectInfo;
					peopleDragging = true;
				}
			}		
										
			//moving people. 
			if(Input.GetMouseButtonUp(0) && peopleDragging == true && !LevelPaused)
			{
				//make sure the player clicked on a planet
				if (Physics.Raycast(Camera.main.ScreenPointToRay(Vector3(Input.mousePosition.x, Input.mousePosition.y, WorldZDepth - Camera.main.transform.position.z)).origin, Camera.main.ScreenPointToRay(Vector3(Input.mousePosition.x, Input.mousePosition.y, WorldZDepth - Camera.main.transform.position.z)).direction, objectInfo))
				{
					if (objectInfo.collider.name == "Icosphere" && selectedWorld.transform.parent.parent.gameObject.GetComponent(AsteroidController).nearestPlanet.name != selectedWorld.collider.name) //if selected an asteroid and the asteroids nearest planet is not itself
					{	
						//if mouse didn't move
						if (mousePos == Input.mousePosition)
						{		
							MovePeople(true);
						}
					}
					//print(selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).nearestPlanet.name);
					if (objectInfo.collider.name == "HumanPlanet" && selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).nearestPlanet != selectedWorld.collider.gameObject) //if selected a human planet
					{
						//if mouse didn't move
						if (mousePos == Input.mousePosition)
						{
							MovePeople(false);
						}
					}
				}
			}
		}
		
		//ios controls
		if (PlatformIOS && !isLevelSelect)
		{
			//reset
			Touching1 = false;
			Touching2 = false;
			
			//first check all touches
			for (var touch : Touch in Input.touches)
			{
				//check touching first
				if (touch.fingerId == 0)
				{
					//first touch
					if (Touch1Start)
					{
						Touch1Start = false;
						Touch1StartPos = touch.position;
						//planet selection
						if (!LevelPaused && !Touch1WorldSelected && Physics.Raycast(Camera.main.WorldToScreenPoint(Vector3(touch.position.x,touch.position.y,Camera.main.transform.position.z)), Camera.main.ScreenToWorldPoint(Vector3(touch.position.x, touch.position.y, WorldZDepth - Camera.main.transform.position.z)), objectInfo))
						{
							//if the planet is draggable
							if (objectInfo.collider.gameObject.GetComponent(PlanetSearcher).Draggable)
							{
								Touch1WorldSelected = true;
								selectedWorld = objectInfo;
								selectedWorld.collider.GetComponent(PlanetSearcher).Selected = true;
								offSet = selectedWorld.transform.position - Camera.main.ScreenToWorldPoint(Vector3(touch.position.x, touch.position.y,WorldZDepth - Camera.main.transform.position.z));
							}
						}
					}
					
					Touching1 = true;
					Touch1EndPos = touch.position;
					Touch1Delta = touch.deltaPosition;
				}
				if (touch.fingerId == 1)
				{
					//first touch
					if (Touch2Start)
					{
						Touch2Start = false;
						Touch2StartPos = touch.position;
						
						//planet selection
						if (!LevelPaused && !Touch2WorldSelected && Physics.Raycast(Camera.main.WorldToScreenPoint(Vector3(touch.position.x,touch.position.y,Camera.main.transform.position.z)), Camera.main.ScreenToWorldPoint(Vector3(touch.position.x, touch.position.y, WorldZDepth - Camera.main.transform.position.z)), objectInfo))
						{
							//if the planet is draggable
							if (objectInfo.collider.gameObject.GetComponent(PlanetSearcher).Draggable)
							{
								Touch2WorldSelected = true;
								selectedWorld = objectInfo;
								selectedWorld.collider.GetComponent(PlanetSearcher).Selected = true;
								offSet = selectedWorld.transform.position - Camera.main.ScreenToWorldPoint(Vector3(touch.position.x, touch.position.y,WorldZDepth - Camera.main.transform.position.z));
							}
						}
					}
					
					Touching2 = true;
					Touch2EndPos = touch.position;
					Touch2Delta = touch.deltaPosition;
				}
			}
			
			//check gestures
			if (Touching1) //touch 1
			{
				//check tap 
				if ((Touch1StartPos.x + TouchTapBounds.x > Touch1EndPos.x) && (Touch1StartPos.x - TouchTapBounds.x < Touch1EndPos.x) && (Touch1StartPos.y + TouchTapBounds.y > Touch1EndPos.y) && (Touch1StartPos.y - TouchTapBounds.y < Touch1EndPos.y))
					Touch1Tap = true;
				else
				{
					Touch1Tap = false;
					Touch1Move = true;
				}
				
				//if planet dragging
				if (!LevelPaused && Touch1WorldSelected && selectedWorld.collider != null && selectedWorld.collider.name != "humanShip" && selectedWorld.collider.name != "Asteroid" && selectedWorld.collider.name != "Icosphere" && selectedWorld.transform.gameObject.name != "RedAsteroid")
				{
					Touch1WorldSelected = true;
					if (TouchAutoMove)
					{
						AutoMoveCheckPhases();
					}
				
					//if the planet is alive then move the planet
					if (selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).Alive)		
						selectedWorld.transform.position = Camera.main.ScreenToWorldPoint(Vector3(Touch1EndPos.x,Touch1EndPos.y,WorldZDepth - Camera.main.transform.position.z)) + offSet;
				}
				
				//camera dragging
				if (!LevelPaused && !Touch1WorldSelected && Touch1Move && CanViewDrag)
				{
					Touch1CameraDragging = true;
					if ( !(Touching1 && Touching2 && !Touch1WorldSelected && !Touch2WorldSelected))
					{
						if (CanMoveCameraHorizontal)
						{
							if (WorldDraggingInverted) {
								this.transform.Translate(Vector3(Touch1Delta.x * DragRate, Touch1Delta.y * DragRate, 0));
							}
							else {
								this.transform.Translate(Vector3(Touch1Delta.x * DragRate * -1, Touch1Delta.y * DragRate * -1, 0));
							}
						}
						else
						{
							if (WorldDraggingInverted) {
								this.transform.Translate(0, Touch1Delta.y * DragRate, 0);
							}
							else {
								this.transform.Translate(0, Touch1Delta.y * DragRate * -1, 0);
							}
						}
					}
				}
			}
			
			if (Touching2) //touch 2
			{				
				//check tap 
				if ((Touch2StartPos.x + TouchTapBounds.x > Touch2EndPos.x) && (Touch2StartPos.x - TouchTapBounds.x < Touch2EndPos.x) && (Touch2StartPos.y + TouchTapBounds.y > Touch2EndPos.y) && (Touch2StartPos.y - TouchTapBounds.y < Touch2EndPos.y))
					Touch2Tap = true;
				else
				{
					Touch2Tap = false;
					Touch2Move = true;
				}
				
				//if planet dragging
				if (!LevelPaused && Touch2WorldSelected && selectedWorld.collider != null && selectedWorld.collider.name != "humanShip" && selectedWorld.collider.name != "Asteroid" && selectedWorld.collider.name != "Icosphere" && selectedWorld.transform.gameObject.name != "RedAsteroid")
				{
					if (TouchAutoMove)
					{
						AutoMoveCheckPhases();
					}
				
					//if the planet is alive then move the planet
					if (selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).Alive)
					{
						selectedWorld.transform.position = Camera.main.ScreenToWorldPoint(Vector3(Touch2EndPos.x,Touch2EndPos.y,WorldZDepth - Camera.main.transform.position.z)) + offSet;
					}
				}
				
				//camera dragging
				if (!LevelPaused && !Touch2WorldSelected && Touch2Move && CanViewDrag)
				{
					Touch2CameraDragging = true;
					if ( !(Touching1 && Touching2 && !Touch1WorldSelected && !Touch2WorldSelected))
					{
						if (CanMoveCameraHorizontal)
						{
							if (WorldDraggingInverted)
							{
								this.transform.Translate(Vector3(Touch2Delta.x * DragRate, Touch2Delta.y * DragRate, 0));
							}
							else
							{
								this.transform.Translate(Vector3(Touch2Delta.x * DragRate * -1, Touch2Delta.y * DragRate * -1, 0));
							}
						}
						else
						{
							if (WorldDraggingInverted)
							{
								this.transform.Translate(0, Touch2Delta.y * DragRate, 0);
							}
							else
							{
								this.transform.Translate(0, Touch2Delta.y * DragRate * -1, 0);
							}
						}
					}
				}
			}
			
			//pinch in gesture
			if (CanScrollZoom && Touching1 && Touching2 && Touch1Move && Touch2Move && Touch1WorldSelected == false && Touch2WorldSelected == false)
			{ 
				//pinching in
				
				//check the x values first if no pinch then check the y
				if ((Touch1StartPos.x > Touch2StartPos.x))
				{
					if ((Touch1StartPos.x > Touch1EndPos.x) && (Touch2StartPos.x < Touch2EndPos.x))
					{
						PinchIn = true; 
						if (!LevelPaused) 
						{
							StopAllCoroutines();
							MoveToWorldView(); 
						}
					}
				}
				else
				{
					if ((Touch1StartPos.x < Touch1EndPos.x) && (Touch2StartPos.x > Touch2EndPos.x))
					{
						PinchIn = true; 
						if (!LevelPaused) 
						{
							StopAllCoroutines();
							MoveToWorldView(); 
						}
					}
				} 
				
				if (!PinchIn && (Touch1StartPos.y > Touch2StartPos.y)) //if no pinch then check the y values 
				{
					if ((Touch1StartPos.y > Touch1EndPos.y) && (Touch2StartPos.y < Touch2EndPos.y))
					{
						PinchIn = true; 
						if (!LevelPaused) 
						{
							StopAllCoroutines();
							MoveToWorldView(); 
						}
					}
				}
				else
				{
					if ((Touch1StartPos.y < Touch1EndPos.y) && (Touch2StartPos.y > Touch2EndPos.y))
					{
						PinchIn = true; 
						if (!LevelPaused) 
						{
							StopAllCoroutines();
							MoveToWorldView(); 
						}
					}
				}  
				
				//pinching out
				//check the x values first if no pinch then check the y 
				if (!PinchIn)
				{
					if ((Touch1StartPos.x > Touch2StartPos.x))
					{
						if ((Touch1StartPos.x < Touch1EndPos.x) && (Touch2StartPos.x > Touch2EndPos.x))
						{
							PinchOut = true; 
							if (LevelPaused) 
							{
								StopAllCoroutines();
								MoveToPlayView(); 
							}
						}
					}
					else
					{
						if ((Touch1StartPos.x > Touch1EndPos.x) && (Touch2StartPos.x < Touch2EndPos.x))
						{
							PinchOut = true; 
							if (LevelPaused) 
							{
								StopAllCoroutines();
								MoveToPlayView(); 
							}
						}
					} 
					
					if (!PinchIn && (Touch1StartPos.y > Touch2StartPos.y)) //if no pinch then check the y values 
					{
						if ((Touch1StartPos.y < Touch1EndPos.y) && (Touch2StartPos.y > Touch2EndPos.y))
						{
							PinchOut = true;
							if (LevelPaused) 
							{
								StopAllCoroutines();
								MoveToPlayView(); 
							}
						}
					}
					else
					{
						if ((Touch1StartPos.y > Touch1EndPos.y) && (Touch2StartPos.y < Touch2EndPos.y))
						{
							PinchOut = true; 
							if (LevelPaused) 
							{
								StopAllCoroutines();
								MoveToPlayView(); 
							}
						}
					}  
				}
			}
			
			//if not touching first touch
			if (!Touching1)
			{
				Touch1Start = true;	
				Touch1CameraDragging = false;
				Touch1Move = false; 
				PinchIn = false; 
				PinchOut = false;
				
				if (Touch1WorldSelected)
				{
					if (!isLevelSelect && selectedWorld != null)
					{
						selectedWorld.collider.GetComponent(PlanetSearcher).Selected = false;
					}
					Touch1WorldSelected = false;
				}
				
				//tap moving people
				if (Touch1Tap && objectInfo.collider != null)
				{
					Touch1Tap = false;
					if (objectInfo.collider.name == "Icosphere") //if selected an asteroid
					{					
						MovePeople(true);
					}
					if (objectInfo.collider.name == "HumanPlanet") //if selected a human planet
					{					
						MovePeople(false);
					}
				}			
			}
			
			//if not touching second touch
			if (!Touching2)
			{
				Touch2Start = true;	
				Touch2CameraDragging = false;
				Touch2Move = false; 
				PinchIn = false;
				PinchOut = false;
				
				if (Touch2WorldSelected)
				{
					if (!isLevelSelect && selectedWorld != null)
					{
						selectedWorld.collider.GetComponent(PlanetSearcher).Selected = false;
					}
					Touch2WorldSelected = false;
				}
				
				//tap moving people
				if (Touch2Tap && objectInfo.collider != null)
				{
					Touch2Tap = false;
					if (objectInfo.collider.name == "Icosphere") //if selected an asteroid
					{
						MovePeople(true);
					}
					if (objectInfo.collider.name == "HumanPlanet") //if selected a human planet
					{	
						MovePeople(false);
					}
				}			
			}
		}		
					
		//check for sun proximity 
		if (!TouchAutoMove)
		{
			for (i = 0; i < worldObjects.length; i++)
			{
				close = false;
				for (x = 0; x < sunObjects.length; x++)
				{
					//if the i object is close to the x object then draw the line
					if ((Vector3.Distance(worldObjects[i].transform.position, sunObjects[x].transform.position) < sunObjects[x].GetComponent(ShrinkCode).radiiSize))
					{
						//if the object is a world then set close to true
						if (worldObjects[i].transform.name == "HumanPlanet")
							close = true;
					}
				}
				//if this planet is not close to anything then its dead
				if (worldObjects[i].transform.name == "HumanPlanet" && !close)
				{
					//worldObjects[i].transform.DetachChildren();
					worldSelected = false;
					GameObject.Instantiate(PlanetExplosion, worldObjects[i].transform.position, Quaternion(0,0,0,0)); 
					LevelLose();
					worldObjects[i].transform.gameObject.GetComponent(PlanetSearcher).Alive = false;
					worldObjects[i].transform.position = Vector3(1000, 1000, 1000);
					worldObjects[i].transform.gameObject.tag = "DEAD";
					peopleAlive -= worldObjects[i].transform.childCount;
					worldObjects = GameObject.FindGameObjectsWithTag("world"); //recreate world objects, removing the dead world
				}
			}
		}
	}
	
	
	
	
	
	
	//level intro transition
	if (CanZoom && !nextLevel && transform.position.z <= camZStopPos && !(SceneScaleController.transform.localScale.x >= 0.97 && SceneScaleController.transform.localScale.y >= 0.97 && SceneScaleController.transform.localScale.x >= 0.97))
	{
		halt = true;
		SceneScaleController.transform.localScale += Vector3(CameraScaleSpeed * Time.deltaTime,CameraScaleSpeed * Time.deltaTime,CameraScaleSpeed * Time.deltaTime);			
	}
	else if(CanZoom && ZoomVirgin)
	{
		ZoomVirgin = false;
		Timer.StartTimer(); //start the level timer
		
		//unparent...ERVERRRTHNNGG
		SceneScaleController.transform.localScale = Vector3(1,1,1);
		for (var obj : GameObject in worldObjects)
		{
			obj.transform.parent == null;
		}
		SceneScaleController.transform.DetachChildren();
		this.transform.DetachChildren();
		
		if (!isLevelSelect) 
		{
			halt = false;
		}
		
		//setup zoom info
		
		//init pause plane
		PausePlane.GetComponent(TextTypeEffect).ParentCheck = false;
		PausePlane.GetComponent(TextTypeEffect).Done = false; 
		PausePlane.GetComponent(TextTypeEffect).TextToType = "PAUSED";
		
		cameraZoomInPos = Vector3(shipLoc.x, shipLoc.y, CameraLocDepth);
		LevelPaused = true;
		CanZoom = false;
	}
	
	//if player hit the people goal. win condition
	if (peopleSaved >= peopleGoal)
	{
		LevelWon();
		FlyAway = true;
		Timer.LevelDone(previousLevel);	
	}
	
	//if player lost
	if (LevelLost)
	{
		FailType.transform.parent = Camera.main.transform;
		isPlayOne = true;
		ZoomIn();
		
		if (transform.position.z >= WorldZDepth + 10)
		{
			StarStreakMat.SetColor("_TintColor",Color(StarStreakMat.GetColor("_TintColor").r, StarStreakMat.GetColor("_TintColor").g, StarStreakMat.GetColor("_TintColor").b, 0));
			sS.n = Application.loadedLevelName;
			sS.SS();
			Application.LoadLevel(Application.loadedLevelName);
		}
	}
	if (FailType.text.Length > 0) {
		halt = true;
	}
	
	//if the level has been beat
	if (nextLevel)
	{
		if(inGame && !fromLSelect)
		{
			isPlayOne = true;
			ZoomIn();
			if (transform.position.z >= WorldZDepth + 10)
			{
				StarStreakMat.SetColor("_TintColor",Color(StarStreakMat.GetColor("_TintColor").r, StarStreakMat.GetColor("_TintColor").g, StarStreakMat.GetColor("_TintColor").b, 0));
				sS.n = Application.loadedLevelName;
				sS.SS();
				Application.LoadLevel("levelselect"); 
			}
		}
		else
		{
			Camera.main.GetComponent(LevelNumberTypeEffect).SendMessage("TypeAway");
			if (Camera.main.GetComponent(LevelNumberTypeEffect).NextLevelReady)
			{
				StarStreakMat.SetColor("_TintColor",Color(StarStreakMat.GetColor("_TintColor").r, StarStreakMat.GetColor("_TintColor").g, StarStreakMat.GetColor("_TintColor").b, 0));
				Application.LoadLevel(Level);
				inGame = true;
				fromLSelect = false;
			}
		}
	}
	
	//check sun shrinking
	if(sunShrink == true)
	{
		shrinkCheck();
	}
}

function SetNextLevel()
{
	sS.b = bTime;
	sS.l = true;
	isPlayOne = true;
	nextLevel = true;	
	halt = true; //stop all the controls
}

//move people between objects
function MovePeople(Asteroid : boolean)
{
	//Get the childCount and store it in num
	num = selectedWorld.transform.childCount;
	n = 0;
		
	//find how many children are already on the planet being moved to
	dummyNum = 0;
	if (!Asteroid)
	{
		dummyChildList = selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).nearestPlanet.transform.gameObject.GetComponentsInChildren(HumanPerson);
	}
	else
	{
		dummyChildList = selectedWorld.transform.parent.parent.gameObject.GetComponent(AsteroidController).nearestPlanet.transform.gameObject.GetComponentsInChildren(HumanPerson);
	}
	dummyNum = dummyChildList.Length;
		
		
	//get human children and move them
	for(i = 0; i < num; i++)
	{
		if (selectedWorld.transform.GetChild(i).tag == "humanPerson")
		{
			if (!Asteroid)
			{
				ReparentChild(selectedWorld.transform.GetChild(i).gameObject, (-15 * n) + (dummyNum * -15), false);
			}
			else
			{
				ReparentChild(selectedWorld.transform.GetChild(i).gameObject, (-15 * n) + (dummyNum * -15), true);
			}
			n++;
		}
	}
						
	//if the people are moving to the spaceship then add their count to the saved people
	if (!Asteroid)
	{
		if (selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).nearestPlanet.transform.gameObject.name == "humanShip")
		{
			peopleSaved += n;
		}
	}
	else
	{
		if (selectedWorld.transform.parent.parent.gameObject.GetComponent(AsteroidController).nearestPlanet.transform.gameObject.name == "humanShip")
		{
			peopleSaved += n;
		}
	}
}

function ReparentChild(datChild : GameObject, rotOffset : int, asteroid : boolean)
{
	//people poof
	GameObject.Instantiate(PeoplePoof, datChild.transform.GetChild(0).transform.position, Quaternion(0,0,0,0)); 
			
	//wait a bit
	yield WaitForSeconds(0.1);
	datChild.gameObject.active = false;
			
	//move child
	datChild.gameObject.active = true;
	if (!asteroid)
	{
		datChild.transform.parent = selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).nearestPlanet.transform;
		datChild.transform.position = selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).nearestPlanet.transform.position;
	}
	else
	{
		datChild.transform.parent = selectedWorld.transform.parent.parent.gameObject.GetComponent(AsteroidController).nearestPlanet.transform;
		datChild.transform.position = selectedWorld.transform.parent.parent.gameObject.GetComponent(AsteroidController).nearestPlanet.transform.position;	
	}
	datChild.transform.rotation.x = 0; //reset rotation
	datChild.transform.rotation.y = 0;
	datChild.transform.rotation.z = 0;
	datChild.transform.rotation.w = 0;
	datChild.transform.Rotate(0, 0, rotOffset, Space.Self);
			
	//people poof from new location
	GameObject.Instantiate(PeoplePoof, datChild.transform.GetChild(0).transform.position, Quaternion(0,0,0,0)); 
}

//check phases for automove
function AutoMoveCheckPhases()
{
	if (selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).StartPhase == 1)
		selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).Phase1 = true;
	if (selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).StartPhase == 2)
		selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).Phase2 = true;
	if (selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).StartPhase == 3)
		selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).Phase3 = true;
	AutoMoving = true;
}

//starting the auto moving phases
function AutoMovingStartPhases()
{
	//reset offSet
	offSet = Vector3.zero;
	
	//if planet is alive and currently in any of the three phases then planet sticks to mouse
	if (selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).Alive && (selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).Phase1 || selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).Phase2 || selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).Phase3))		
			selectedWorld.transform.position = Camera.main.ScreenToWorldPoint(Vector3(Input.mousePosition.x,Input.mousePosition.y,WorldZDepth - Camera.main.transform.position.z)) + offSet;
	else
		AutoMoving = false;
			
	//if phase one then move camera up along the y axis
	if (selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).Phase1)
	{
		Phase1 = true;
		transform.Translate(Vector3(0,DragRate,0));
	}
		
	//if phase two the move camera horizontally
	if (selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).Phase2)
	{
		Phase1 = false;
		Phase2 = true;
		transform.Translate(Vector3(DragRate,0,0));
	}
		
	//if phase three then move camera down along the y axis
	if (selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).Phase3)
	{
		Phase2 = false;
		Phase3 = true;
		transform.Translate(Vector3(0,-DragRate,0));
	}
}

//level resetting wait
function Reset ()
{
	yield WaitForSeconds(1.5);
	Application.LoadLevel(Application.loadedLevel);
}

//zoom the camera in as a transition to the next level
function ZoomIn ()
{
	Transitioning = true;
	
	//parent the background stuff to the camera
	//StarBackground.transform.parent = this.transform;
	NebulaBackground.transform.parent = this.transform;
	
	//transition stars
	if (StarStreakMat.GetColor("_TintColor").a < 0.4)
	{
		StarStreakMat.SetColor("_TintColor",Color(StarStreakMat.GetColor("_TintColor").r, StarStreakMat.GetColor("_TintColor").g, StarStreakMat.GetColor("_TintColor").b, StarStreakMat.GetColor("_TintColor").a + 0.013));
	}
	TransitionStars.transform.position.z -= 2;
	
	//move the camera in
	transform.position.z += CameraPositionSpeed * Time.deltaTime;
}

//Sun Shrinking Code
function shrinkCheck()
{
	//shrink all the suns	
	for(var sun: GameObject in sunObjects)
	{
		//wait until the level transition is over
		if (sun.transform.parent == null)
		{
			shrinkCode = sun.GetComponent(ShrinkCode);
			if(shrinkCode.check == true && !shrinkCode.dead)
			{
				radiiBall = sun.transform.Find("SunRadiiFade");
				radiiBall.localScale -= Vector3(shrinkCode.shrinkSpeed * .1 * Time.deltaTime,shrinkCode.shrinkSpeed * .1 * Time.deltaTime, shrinkCode.shrinkSpeed * .1 * Time.deltaTime);
				shrinkCode.radiiSize -= shrinkCode.shrinkSpeed * .1 * Time.deltaTime;			
			}
			
			//if the sun is totally shrunk
			if (shrinkCode.radiiSize <= 1 && !shrinkCode.dead)
			{
				//create explosion
				GameObject.Instantiate(PlanetExplosion, sun.transform.position, Quaternion(0,0,0,0)); 
				
				//move sun
				sun.transform.position = Vector3(1000,1000,1000);
				
				//sun is dead
				shrinkCode.dead = true;
			}
		}
	}
}

//Code for MainMenu
function MainMenu()
{
	//stop all other functions
	halt = true;
	if(Input.GetMouseButton(0))
	{
		if(Physics.Raycast(Camera.main.WorldToScreenPoint(Vector3(Input.mousePosition.x,Input.mousePosition.y,Camera.main.transform.position.z)), Camera.main.ScreenToWorldPoint(Vector3(Input.mousePosition.x, Input.mousePosition.y, WorldZDepth - Camera.main.transform.position.z)), objectInfo))
		{
			if(objectInfo.collider.name == "start")
			{
				//Level transition effect
				while(!(transform.position.z >= WorldZDepth + 10))
				{
					ZoomIn();
					yield WaitForSeconds(.01);
				}
				//Loads level and sets variables to proper states
				if(transform.position.z >= WorldZDepth + 10)
				{
					Application.LoadLevel("intro to moving people - The The Impotence");
					isMenu = false;
					isLevelSelect = false;
					isOptions = false;
					inGame = true;
				}
			}
			if(objectInfo.collider.name == "select")
			{
				while(!(transform.position.z >= WorldZDepth + 10))
				{
					ZoomIn();
					yield WaitForSeconds(.01);
				}
				if(transform.position.z >= WorldZDepth + 10)
				{
					Application.LoadLevel("levelselect");
					isLevelSelect = true;
					isMenu = false;
					inGame = false;
				}
			}	
			//Not functional yet, but if we have an options menu and an exit planet as well these are here for that.
			if(objectInfo.collider.name == "options")
			{
				Application.LoadLevel("options");
				isMenu = false;
				isLevelSelect = false;
				isOptions = true;
				inGame = false;
			}	
			if(objectInfo.collider.name == "exit")
				Application.Quit();
		}
	}
}

//Code for Level Select functionality
function LevelSelect()
{
	halt = true;
	
	if (PlatformPC)
	{
		//selecting level select objects
		if(Input.GetMouseButtonDown(0))
		{
			if(Physics.Raycast(Camera.main.WorldToScreenPoint(Vector3(Input.mousePosition.x,Input.mousePosition.y,Camera.main.transform.position.z)), Camera.main.ScreenToWorldPoint(Vector3(Input.mousePosition.x, Input.mousePosition.y, WorldZDepth - Camera.main.transform.position.z)), objectInfo))
			{
				//if a level tag
				if (objectInfo.collider.tag == "LevelTag" && (objectInfo.collider.transform.Find("Num").GetComponent(TextMesh).text != "BOSS LEVEL"))
				{
					//Level is set to the collider's name and then loaded. See "nextLevel" code in update function.
					previousLevel = int.Parse(objectInfo.collider.transform.Find("Num").GetComponent(TextMesh).text);
					Level = objectInfo.collider.name;
					PrevLevelLoc = LevelSelectMovementController.transform.position;
					LevelOffset = Vector3.zero;
					nextLevel = true;
					isLevelSelect = false;
					isMenu = false;
					inGame = true;
					fromLSelect = true;
				}
				else if(objectInfo.collider.tag == "LevelTag" && objectInfo.collider.transform.Find("Num").GetComponent(TextMesh).text == "BOSS LEVEL") //check boss level
				{
					if (!this.GetComponent(KeyLockingController).Locked)
					{
						previousLevel = 20;
						Level = objectInfo.collider.name;
						PrevLevelLoc = LevelSelectMovementController.transform.position;
						LevelOffset = Vector3.zero;
						nextLevel = true;
						isLevelSelect = false;
						isMenu = false;
						inGame = true;
						fromLSelect = true;
					}
					else
					{
						print("locked");
					}
				}
			}
		}

		//for horizontal scrolling
		LevelOffset.x += Input.GetAxis("Mouse ScrollWheel") * Time.deltaTime * 1000;
	}
	
	if (PlatformIOS)
	{
		//reset
		Touching1 = false;
		
		//get touches
		for (var touch : Touch in Input.touches)
		{
			Touching1 = true;
			Touch1EndPos = touch.position;
			
			//check the first touch
			if (touch.fingerId == 0)
			{
				//get start pos
				if (Touch1Start)
				{
					Movement1Delta = Vector2.zero;
					Touch1StartPos = touch.position;
					Touch1Start = false;
					Touch1Move = false;
				}
				//check if a tap, if not then a drag
				if ((Touch1StartPos.x + TouchTapBounds.x > Touch1EndPos.x) && (Touch1StartPos.x - TouchTapBounds.x < Touch1EndPos.x) && (Touch1StartPos.y + TouchTapBounds.y > Touch1EndPos.y) && (Touch1StartPos.y - TouchTapBounds.y < Touch1EndPos.y))
					Touch1Tap = true;
				else if (Touch1StartPos.y < 250) //if a move and on the bottom half of the screen
				{						
					Touch1Move = true;
					Touch1Tap = false;
					 
					MovementControllerOldPos = LevelOffset;
					//limit movement 
					if (LevelSelectMovementController.transform.position.x + (touch.deltaPosition.x * Time.deltaTime) * LevelSelectDragRate < 8) //left side 
					{ 
						LevelOffset.x += (touch.deltaPosition.x * Time.deltaTime) * LevelSelectDragRate;
					}
					else 
					{ 
						LevelOffset.x = 8; 
						return; //then kick out
					}
					if (LevelSelectMovementController.transform.position.x + (touch.deltaPosition.x * Time.deltaTime) * LevelSelectDragRate > -120) //right side
					{ 
						LevelOffset.x += (touch.deltaPosition.x * Time.deltaTime) * LevelSelectDragRate;
					}
					else 
					{
						LevelOffset.x += -120; 
						return; //kick out
					}
						
					Movement1Delta = MovementControllerOldPos - LevelOffset;
				}			
			}
		}
		
		//if not touching
		if (!Touching1)
		{
			//reset
			Touch1Start = true;
			
			//check flicking
			if (Touch1Move)
			{				
				//limit movement
				if (LevelOffset.x - Movement1Delta.x < 8) //left side
				{ 
					LevelOffset.x -= (Movement1Delta.x);
				}
				else
				{
					//end the flick
					print("limiting and ending the flick now");
					LevelOffset.x = 8;
					
					Touch1StartPos = Vector2(0,0);
					Touch1EndPos = Vector2(1000,1000);		
					Movement1Delta.x = 0;
					Touch1Move = false;
				}
				if (LevelOffset.x - Movement1Delta.x > -120) //right side 
				{
					LevelOffset.x -= (Movement1Delta.x); 
				}
				else
				{
					//end the flick
					print("limiting and ending the flick");
					LevelOffset.x = -120;
					
					Touch1StartPos = Vector2(0,0);
					Touch1EndPos = Vector2(1000,1000);		
					Movement1Delta.x = 0;
					Touch1Move = false;
				}
				
				//degrade movement delta
				Movement1Delta.x = Movement1Delta.x * 0.9;
				
				//end the flick
				if ( (Movement1Delta.x > 0 && Movement1Delta.x <= 0.01) || Movement1Delta.x < 0 && Movement1Delta.x >= -0.01)
				{
					Touch1StartPos = Vector2(0,0);
					Touch1EndPos = Vector2(1000,1000);		
					Movement1Delta.x = 0;
					Touch1Move = false;
				}
			}
			
			//check a tap			
			if (Touch1Tap && (Touch1StartPos.x + TouchTapBounds.x > Touch1EndPos.x) && (Touch1StartPos.x - TouchTapBounds.x < Touch1EndPos.x) && (Touch1StartPos.y + TouchTapBounds.y > Touch1EndPos.y) && (Touch1StartPos.y - TouchTapBounds.y < Touch1EndPos.y) )
			{
				if(Physics.Raycast(Camera.main.WorldToScreenPoint(Vector3(Touch1StartPos.x,Touch1StartPos.y,Camera.main.transform.position.z)), Camera.main.ScreenToWorldPoint(Vector3(Touch1StartPos.x, Touch1StartPos.y, WorldZDepth - Camera.main.transform.position.z)), objectInfo))
				{
					//Level is set to the collider's name and then loaded. See "nextLevel" code in update function.
					previousLevel = int.Parse(objectInfo.collider.transform.Find("Num").GetComponent(TextMesh).text);
					Level = objectInfo.collider.name;
					nextLevel = true;
					isLevelSelect = false;
					isMenu = false;
					inGame = true;
					fromLSelect = true;
					//Goes back to main menu	
					if(objectInfo.collider.name == "mainmenu")
					{
						Application.LoadLevel("mainmenu");
						isLevelSelect = false;
						isMenu = true;
					}
					
					Touch1Tap = false;
					Touch1StartPos = Vector2(0,0);
					Touch1EndPos = Vector2(1000,1000);
				}
				else
				{
					Touch1StartPos = Vector2(0,0);
					Touch1EndPos = Vector2(1000,1000);
					Touch1Tap = false;
				}
			}
		}
	}
}

//gui
function OnGUI()
{
	if (!isLevelSelect)
	{
		//back to level select button
		if (GUI.Button(Rect(10,10,50,30),"Back"))
		{
			peopleGoal = 0;
		}
	}
} 

//zoom world out and pause everything. go to world view. PinchIn
function MoveToWorldView()
{
	cameraZoomInPos = transform.position;
	cameraZoomInPos.z = CameraLocDepth;
	//type in pause text
	PausePlane.GetComponent(TextTypeEffect).Done = false;
	PausePlane.GetComponent(TextTypeEffect).TextToType = "PAUSED";
	
	//move out camera
	yield StartCoroutine(MoveTo(0.2,CameraZoomOutPos));
	
	LevelPaused = true;
	CanZoom = false;
}

//zoom world in and play everything. go to play view. PinchOut
function MoveToPlayView()
{	
	//type away pause text
	PausePlane.GetComponent(TextTypeEffect).Done = false;
	PausePlane.GetComponent(TextTypeEffect).TextToType = " ";
	
	//move in camera
	yield StartCoroutine(MoveTo(0.2,cameraZoomInPos));
	
	LevelPaused = false;
	CanZoom = true;
}

//push the camera around when dragging planets
function CameraViewPlanetPushing()
{
	//pc controls
	if (PlatformPC)
	{
		if (worldSelected)
		{
			//get view coordinates
			dummyVector2 = Camera.main.WorldToScreenPoint(selectedWorld.transform.position);
			
			
			//print(Camera.main.pixelWidth / 2);
			//print((Camera.main.pixelWidth / 2) + PlanetPushBuffer.x);
			//print(dummyVector2.x);
			
			//left
			if (dummyVector2.x < ((Camera.main.pixelWidth / 2) - PlanetPushBuffer.x))
			{
				this.transform.Translate(Vector3((DragRate / 2) * -1, 0, 0));
			}
			//right
			if (dummyVector2.x > ((Camera.main.pixelWidth / 2) + PlanetPushBuffer.x))
			{
				this.transform.Translate(Vector3(DragRate / 2, 0, 0));
			}
			//top
			if (dummyVector2.y > ((Camera.main.pixelHeight / 2) + PlanetPushBuffer.y))
			{
				this.transform.Translate(Vector3(0, DragRate / 2, 0));
			}
			//bottom
			if (dummyVector2.y < ((Camera.main.pixelHeight / 2) - PlanetPushBuffer.y))
			{
				this.transform.Translate(Vector3(0, (DragRate / 2) * -1, 0));
			}
		}
	}
}

//if the level was lost
function LevelLose()
{
	halt = true;
	yield WaitForSeconds(0.2);
	FailType.GetComponent(TextTypeEffect).TextToType = "LEVEL FAIL";
	FailType.GetComponent(TextTypeEffect).Done = false;
	
	yield WaitForSeconds(1.5);
	
	//untype old text
	LevelLost = true;
	str = FailType.text;
	j = str.Length;
	for (i = 0; i < j; i++)
	{
		if (str.Length > 0)
		{
			str = str.Substring(0, str.Length - 1);
			FailType.text = str;
			yield WaitForSeconds(0.05);
		}
	}
}

//if the level is won
function LevelWon()
{
	if (!levelWon)
	{
		levelWon = true;
		FailType.GetComponent(TextTypeEffect).TextToType = "LEVEL WON";
		FailType.GetComponent(TextTypeEffect).Done = false;
	}
}

function MoveTo(time : float, target : Vector3)
{
	//set rates and get start time
	xRate = (target.x - transform.position.x) / (time);
	yRate = (target.y - transform.position.y) / (time);
	zRate = (target.z - transform.position.z) / (time);
	
	//move stuff
	if (transform.position.z > target.z)
	{
		do
		{
			transform.position.x += xRate * Time.deltaTime;
			transform.position.y += yRate * Time.deltaTime;
			transform.position.z += zRate * Time.deltaTime;
			yield;
		} while (transform.position.z > target.z);
		return;
	}
	if (transform.position.z < target.z)
	{
		print("in here");
		do
		{
			transform.position.x += xRate * Time.deltaTime;
			transform.position.y += yRate * Time.deltaTime;
			transform.position.z += zRate * Time.deltaTime;
			yield;
		} while (transform.position.z < target.z);
		return;
	}
}