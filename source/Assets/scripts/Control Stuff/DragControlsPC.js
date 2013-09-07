#pragma strict

//just some notes
//
//
//the camera MUST be at 0,0,0 at the start of the level
//objects cannot have a z larger than 100

//public vars
public var objectInfo : RaycastHit;
public var selectedWorld : RaycastHit;
public var tempSelectedWorld : RaycastHit;

public var peopleSaved = 0; //number of people saved
public var peopleGoal : int; //win condition of the level
public var peopleAlive : int; //People # Monitor
public var WorldZDepth : int; //depth of the plane which all interactable object sit on
public var CameraLocDepth : int; //the z depth which the camer sits on
public static var previousLevel = 0; //the level num which the player was in last

public var worldDist : float; //distance which the worlds must stay to the sun
public var DragRate : float; //speed which player moves the world around
public var CameraPositionSpeed : float; // the speed which the camera moves in during the level transitions
public var CameraScaleSpeed : float; //the speed which the world scales up and down in the level transitions ƒ
public var LevelSelectDragRate : float; //rate at which the level select tags are drug  
public var TutorialTypeSpeed : float; //the speed at which the tutorials are typed

static var leveloffsetX : float;//save level offest x position
static var leveloffsetY : float;
static var leveloffsetZ : float;

static var WorldDraggingInverted : boolean; //if world dragging is inverted
public var CanMoveCameraHorizontal : boolean; //if the player can move the camera horizontally
public var TouchAutoMove : boolean; //if true then when a planet is touched, the camera will automatically move up until the end of the level. used on the boss level
public var sunShrink : boolean;
public var AutoMoving = false; //boss level moving
public var isLevelSelect : boolean;
public var isMainMenu : boolean; //if this level is the main menu
public var isSettingsMenu : boolean; //if this scene is the settings menu
public var isContactMenu : boolean; //if this scene is the contact menu
public var CanScrollZoom : boolean; //if the level can scrool zoom, also pinch zoom
public var DoubleTapZoom : boolean; //if the level can double tap / double click zoom
public var LevelPaused : boolean; //if the level is paused. Only zoom controls work if the level is paused. 
public var CanViewDrag : boolean; //if the player can drag the view around through touching in blank space.
public var CameraViewPlanetPush : boolean; //if pushing a planet toward the edge of the screen then the camera moves
public var Transitioning = false; //if the level is in transition or not
public var LevelLost = false; //triggered by lose condition
public var FlyAway = false; //flying the spaceship away to the next level
public var StartZoomedOut = true; //if the level starts in the paused zoomed out view or the play view
public var levelWon = false;
public var nextLevel = false;
public var skipZoom = true;

public var Phase1 = false;
public var Phase2 = false;
public var Phase3 = false;

public var PlatformIOS = false;
public var PlatformPC = false;

public var canMoveToWorld = true; //if can zoom to world
public var canMoveToPlay = false; //if can zoom to play

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
public var HumanPersonFab : GameObject; //the human person prefab
public var PausePlane : GameObject; //the pause plane which will show when zoomed out
public var ZoomStreaks : GameObject; //the star streaks which show when zooming
public var FailType : TextMesh; //the type which shows on level fail
public var StarStreakMat : Material;
public var KeyMat : Material; //the material used for the keys






//floats
private var rotationSpeed = 10.0;
private var lerpSpeed = 1.0;
private var f = 0.0;
private var startTime : float;
private var levelFinishCamZoomMultiplier : float; //jesus what a long var name. basically it is incremented each cycle so the camera zooms exponentially at the end of a level.

//ints
private var camZStopPos = -11;
private var n : int;
private var i : int;
private var x : int;
private var j : int;
private var num : int;
private var dummyNum : int;
private var xRate : int; //rate of movement in x axis (used for MoveTo())
private var yRate : int; //rate of movement in y axis
private var zRate : int; //rate of movement in z axis
private var MoveNum : int; //used for moving people
private var MoveI : int; //used for moging people
private var MoveN : int; //used for moving people
private var MoveDummyNum : int; //used for moving people

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
private var cont : boolean;
var halt : boolean; //Stops events in the level from running until the zoom sequence has finished.
static var isPlayOne : boolean; //Determines if the Camera should zoom in or not.
static var inGame : boolean;
static var fromLSelect : boolean;
private var buttonPushed = false;//if the back button was pushed
private var CanZoom = true; //if the level can level transition zoom
private var LevelFirst = true;
private var ZoomVirgin = true;
private var tagPressed = false; //if a level tag has been pressed or not
private var iosTagDepress = false;  //if a tag is depressed
private var FadeKick = false; //if kick out of the level tag fading
private var toSettings = false; //moving to the setting scene
private var toContact = false; //moving to the contact scene
private var toLevelSelect = false; //move to the level select scene
private var toLevel = false; //moving to a level scene
private var toMainMenu = false; //moving to the main menu scene

//Strings
private var Level : String;
private var str : String;

//other... things...
private var depressedTag : RaycastHit;
private var selectedPlanet : Transform;
private var mousePos : Vector3;
private var offSet : Vector3;
private var worldScreenPoint : Vector3;
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
private var dummyObj : GameObject; //a dummy game object

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
public var tapCount = 0; //the number of taps within the tap time limit. used for detecting doubel taps
private var tapTimeLimit = 0.3; //the time to wait unitl resetting tapCount


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
	TutorialTypeSpeed = 0.03;
	levelFinishCamZoomMultiplier = 0;
	
	if (!LevelSelect)
	{
		shipLoc = GameObject.Find("humanShip").transform.position;
	}
	
	if (StartZoomedOut)
	{
		LevelPaused = true;
	}
	
	cameraZoomInPos = transform.Find("ZoomInInit").transform.position;
	
	//center scale controller
	SceneScaleController.transform.position = Vector3(this.transform.position.x, this.transform.position.y, SceneScaleController.transform.position.z);
	
	//level select init
	if (isLevelSelect) 
	{
		//key fading
		KeyMat.color.a = 0;
		FadeInKeys();
		
		//instant zoom
		transform.position.z = camZStopPos;
	}
	
	//other menu inits
	if (isMainMenu || isSettingsMenu || isContactMenu)
	{
		//instant zoom
		transform.position.z = camZStopPos;
	}
	
	objects = GameObject.FindObjectsOfType(GameObject);
	worldObjects = GameObject.FindGameObjectsWithTag("world");
	sunObjects = GameObject.FindGameObjectsWithTag("sun");
	personObjects = GameObject.FindGameObjectsWithTag("humanPerson");

	//This is kinda important, it keeps everything properly parented so this sorting step is necessary
	if (!isLevelSelect && !isMainMenu && !isSettingsMenu && !isContactMenu)
	{
		for (i = 0; i < objects.length; i++)
		{	
			//if tagged as a world
			if (objects[i].tag == "world")
			{
				objects[i].transform.parent = SceneScaleController.transform;
			}
			//if tagged as a sun
			if (objects[i].tag == "sun")
			{
				objects[i].transform.parent = SceneScaleController.transform;
			}
			//if tagged as ui
			if (objects[i].tag == "ui")
			{
				objects[i].transform.parent = SceneScaleController.transform;
			}
			//if an asteroid
			if (objects[i].name == "Asteroid")
			{
				objects[i].transform.parent = SceneScaleController.transform;
			}
			//SunRadiiController
			if (objects[i].name == "SunRadiiHolder(Clone)")
			{
				objects[i].transform.parent = SceneScaleController.transform;
			}
			if (objects[i].name == "SunChainCircle")
			{
				objects[i].transform.parent = SceneScaleController.transform;
			}
			//debris
			if (objects[i].tag == "Debris")
			{
				objects[i].transform.parent = SceneScaleController.transform;
			}
			//red asteroids
	//		if (objects[i].name == "RedAsteroid")
	//			objects[i].transform.parent = SceneScaleController.transform;
		}
	}

	peopleGoal = personObjects.length;
	peopleAlive = personObjects.length;
	
	//scale down
	if (!isLevelSelect && !isMainMenu && !isSettingsMenu && !isContactMenu && !skipZoom) 
	{
		SceneScaleController.transform.localScale = Vector3(0,0,0); 
	}
	
	//set platform and platform specific settings
	if (Application.platform == RuntimePlatform.IPhonePlayer)
	{
		print("IOS");
		DragRate = 0.02;
		PlatformIOS = true;
		PlatformPC = false;
	}
	else
	{
//		print("IOS");
//		DragRate = 0.02;
//		PlatformIOS = true;
//		PlatformPC = false;
		print("PC");
		PlatformPC = true;
		PlatformIOS = false;
		WorldDraggingInverted = true;
	}
	
	//ios initializations
	if (PlatformIOS)
	{
		LevelOffset = Vector3(leveloffsetX, leveloffsetY, leveloffsetZ);
	}
	
	//pc initializations
	if (PlatformPC)
	{
		CanScrollZoom = true;
		CanViewDrag = true;
		WorldDraggingInverted = true;
	}
	
}

//main update function
function Update ()
{
	//rest stuff
	Transitioning = false;
	
	//just menu stuff. this code is shit
	if(isLevelSelect)
	{
		LevelSelect();
		LevelSelectMovementController.transform.position = PrevLevelLoc + LevelOffset;
	}
	else
	{
		LevelFirst = true;
	}
	if (isMainMenu)
	{
		MainMenu();
	}	
	if (isSettingsMenu)
	{
		SettingsMenu();
	}
	if (isContactMenu)
	{
		ContactMenu();
	}

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
			if (!LevelPaused && Input.GetMouseButton(0) && worldSelected && selectedWorld.collider != null && selectedWorld.collider.name != "humanShip" && selectedWorld.collider.name != "Asteroid" && selectedWorld.collider.name != "AsteroidCenter" && selectedWorld.transform.gameObject.name != "RedAsteroid")//&& !selectedWorld.collider.GetComponentInChildren(planetLifeIndicator).dead)
			{
				if (TouchAutoMove)
				{
					AutoMoveCheckPhases();
				}
				
				//if the planet is alive then move the planet
				if (selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).Alive)		
					selectedWorld.transform.position = Camera.main.ScreenToWorldPoint(Vector3(Input.mousePosition.x,Input.mousePosition.y,WorldZDepth - Camera.main.transform.position.z)) + offSet;
			}
			//if view dragging
			if ( (Input.GetAxis("Horizontal") || Input.GetAxis("Vertical")) && !LevelPaused && CanViewDrag)
			{
				if (CanMoveCameraHorizontal)
				{
					if (WorldDraggingInverted) 
					{
						FailType.transform.parent = this.transform;
						this.transform.Translate(Vector3(Input.GetAxis("Horizontal") * DragRate, Input.GetAxis("Vertical") * DragRate, 0));
					}
					else 
					{
						FailType.transform.parent = this.transform;
						this.transform.Translate(Vector3(Input.GetAxis("Horizontal") * DragRate * -1, Input.GetAxis("Vertical") * DragRate * -1, 0));
					}
				}
				else
				{
					if (WorldDraggingInverted) 
					{
						FailType.transform.parent = this.transform;
						this.transform.Translate(0, Input.GetAxis("Vertical") * DragRate, 0);
					}
					else 
					{
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
					if (objectInfo.collider.name == "AsteroidCenter" && selectedWorld.transform.parent.parent.gameObject.GetComponent(AsteroidController).nearestPlanet != selectedWorld.collider.gameObject) //if selected an asteroid and the asteroids nearest planet is not itself
					{	
						//if mouse didn't move
						if (mousePos == Input.mousePosition && selectedWorld.transform.parent.parent.gameObject.GetComponent(AsteroidController).nearestPlanet != selectedWorld.collider.gameObject)
						{
							MovePeople(true);
						}
					}
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
						//check double tapping. do this while touch1startpos still holds the last touch position
						tapCount++;
						TapResetWait();
						if (tapCount >= 2 && DoubleTapZoom && (touch.position.x > Touch1StartPos.x - 20 && touch.position.x < Touch1StartPos.x + 20) && (touch.position.y > Touch1StartPos.y - 20 && touch.position.y < Touch1StartPos.y + 20)) //if double tapped then zoom into that position
						{
							tapCount = 0;
							if (LevelPaused) 
							{
								//set the position to zoom the camera in 
								cameraZoomInPos = Camera.main.ScreenToWorldPoint(Vector3(touch.position.x, touch.position.y, WorldZDepth - Camera.main.transform.position.z));
								cameraZoomInPos.z = CameraLocDepth;
								
								MoveToPlayView();
							}
							else
							{
								MoveToWorldView();
							}
						}

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
							
							//if tapped the reset button
							if (objectInfo.collider.name == "BackArrow")
							{
								print("hit back");
							}
						}
					}
					
					Touching1 = true;
					Touch1EndPos = touch.position;
					Touch1Delta = touch.deltaPosition;
				}
				//check second touch
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
				if (!LevelPaused && Touch1WorldSelected && selectedWorld.collider != null && selectedWorld.collider.name != "humanShip" && selectedWorld.collider.name != "Asteroid" && selectedWorld.collider.name != "AsteroidCenter" && selectedWorld.transform.gameObject.name != "RedAsteroid")
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
				if (!LevelPaused && Touch2WorldSelected && selectedWorld.collider != null && selectedWorld.collider.name != "humanShip" && selectedWorld.collider.name != "Asteroid" && selectedWorld.collider.name != "AsteroidCenter" && selectedWorld.transform.gameObject.name != "RedAsteroid")
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
							//StopAllCoroutines();
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
							//StopAllCoroutines();
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
							//StopAllCoroutines();
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
							//StopAllCoroutines();
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
								//StopAllCoroutines();
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
								//StopAllCoroutines();
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
								//StopAllCoroutines();
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
								//StopAllCoroutines();
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
				
				//check touch location again this time for tap purposes
				if (Physics.Raycast(Camera.main.WorldToScreenPoint(Vector3(Touch1StartPos.x,Touch1StartPos.y,Camera.main.transform.position.z)), Camera.main.ScreenToWorldPoint(Vector3(Touch1StartPos.x, Touch1StartPos.y, WorldZDepth - Camera.main.transform.position.z)), objectInfo))
				{
					selectedWorld = objectInfo;
				}
				
				//tap moving people
				if (Touch1Tap && objectInfo.collider != null)
				{	
					Touch1Tap = false;	
						
					if (selectedWorld.collider.name == "AsteroidCenter") //if selected an asteroid
					{			
						MovePeople(true);
					}
					if (selectedWorld.collider.name == "HumanPlanet" && selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).nearestPlanet != selectedWorld.collider.gameObject) //if selected a human planet
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
				
				//check touch location again this time for tap purposes
				if (Physics.Raycast(Camera.main.WorldToScreenPoint(Vector3(Touch1StartPos.x,Touch1StartPos.y,Camera.main.transform.position.z)), Camera.main.ScreenToWorldPoint(Vector3(Touch1StartPos.x, Touch1StartPos.y, WorldZDepth - Camera.main.transform.position.z)), objectInfo))
				{
					selectedWorld = objectInfo;
				}
				
				//tap moving people
				if (Touch2Tap && objectInfo.collider != null)
				{
					Touch2Tap = false;
					if (selectedWorld.collider.name == "AsteroidCenter") //if selected an asteroid
					{
						MovePeople(true);
					}
					if (selectedWorld.collider.name == "HumanPlanet") //if selected a human planet
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
				if (worldObjects[i].transform.name == "HumanPlanet" && !close && !worldObjects[i].GetComponent(PlanetSearcher).Invincible)
				{
					//check if people on the planet to know if the level has been lost or not
					if (worldObjects[i].transform.Find("HumanPerson") != null)
					{
						LevelLose();
					}
					
					//clean up scene and delete planet
					worldSelected = false; //world not selected
					GameObject.Instantiate(PlanetExplosion, worldObjects[i].transform.position, Quaternion(0,0,0,0)); //create explosion
					worldObjects[i].SendMessage("KillPlanet"); //kill planet
					worldObjects = GameObject.FindGameObjectsWithTag("world"); //recreate world objects, removing the dead world
				}
			}
		}
	}
	
	
	
	
	
	
	//level intro transition
	if (!skipZoom && CanZoom && !nextLevel && transform.position.z <= camZStopPos && !(SceneScaleController.transform.localScale.x >= 0.97 && SceneScaleController.transform.localScale.y >= 0.97 && SceneScaleController.transform.localScale.x >= 0.97))
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
		
		//if start zoomed out and paused
		if (StartZoomedOut)
		{
			canMoveToWorld = false;
			canMoveToPlay = true;
			
			PausePlane.GetComponent(TextTypeEffect).ParentCheck = false;
			PausePlane.GetComponent(TextTypeEffect).Done = false; 
			PausePlane.GetComponent(TextTypeEffect).TextToType = "PAUSED";
			
			//set z for zoom in pos
			cameraZoomInPos.z = CameraLocDepth;
		
			LevelPaused = true;
			CanZoom = false;
		}
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
			Application.LoadLevel(Application.loadedLevelName);
		}
	}
	if (FailType.text.Length > 0) {
		halt = true;
	}
	
	//if the level has been beat
	if (nextLevel)
	{
		//moving to the settings scene
		if (toSettings)
		{
			toLevelSelect = false;
			isPlayOne = true;
			ZoomIn();
			if (transform.position.z >= WorldZDepth + 10)
			{
				Application.LoadLevel("Settings_SCE");
			}
		}
		
		//moving to the contact scene
		if (toContact)
		{
			toLevelSelect = false;
			isPlayOne = true;
			ZoomIn();
			if (transform.position.z >= WorldZDepth + 10)
			{
				Application.LoadLevel("Contact_SCE");
			}
		}
		
		//moving to the level select scene
		if (toLevelSelect)
		{
			isPlayOne = true;
			ZoomIn();
			if (transform.position.z >= WorldZDepth + 100)
			{
				StarStreakMat.SetColor("_TintColor",Color(StarStreakMat.GetColor("_TintColor").r, StarStreakMat.GetColor("_TintColor").g, StarStreakMat.GetColor("_TintColor").b, 0));
				Application.LoadLevel("levelselect"); 
			}
		}
		
		//moving to a level
		if (toLevel)
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
		
		//moving to the main menu scene
		if (toMainMenu)
		{
			isPlayOne = true;
			ZoomIn();
			if (transform.position.z >= WorldZDepth + 10)
			{
				Application.LoadLevel("MainMenu");
			}
		}
	}
	
	//check sun shrinking
	if(sunShrink == true)
	{
		shrinkCheck();
	}
}
 
//fade out the keys
function FadeOutKeys()
{
	do
	{
		KeyMat.color.a -= Time.deltaTime * 2;
		yield WaitForSeconds(0.01);
	} while (KeyMat.color.a > 0);
}
 
//fade in the keys
function FadeInKeys()
{
	do
	{
		KeyMat.color.a += Time.deltaTime * 2;
		yield WaitForSeconds(0.01);
	} while (KeyMat.color.a < 1);
}

//set the next level... hence the name.
function SetNextLevel()
{
	isPlayOne = true;
	nextLevel = true;	
	halt = true; //stop all the controls
}

//move people between objects
function MovePeople(Asteroid : boolean)
{
	if (canMoveToWorld)
	{
		//Get the childCount and store it in num
		tempSelectedWorld = selectedWorld;
		MoveNum = tempSelectedWorld.transform.childCount;
		MoveN = 0;
		
		//find how many children are already on the planet being moved to
		MoveDummyNum = 0;
		if (!Asteroid)
		{
			dummyChildList = tempSelectedWorld.transform.gameObject.GetComponent(PlanetSearcher).nearestPlanet.transform.gameObject.GetComponentsInChildren(HumanPerson);
		}
		else
		{
			dummyChildList = tempSelectedWorld.transform.parent.parent.gameObject.GetComponent(AsteroidController).nearestPlanet.transform.gameObject.GetComponentsInChildren(HumanPerson);
		}
		MoveDummyNum = dummyChildList.Length;
		
		//get list of children being moved
		if (!Asteroid)
		{
			dummyChildList = tempSelectedWorld.transform.gameObject.GetComponentsInChildren(HumanPerson);
		}
		else
		{
			dummyChildList = tempSelectedWorld.transform.parent.parent.GetComponentsInChildren(HumanPerson);
		}
		
		//get human children and move them
		for(MoveI = 0; MoveI < dummyChildList.Length; MoveI++)
		{
			if (!Asteroid)
			{
				yield StartCoroutine(ReparentChild(dummyChildList[MoveI].gameObject, (-25 * MoveN) + (-25 * MoveDummyNum)));
				//if moving to the human ship then turn hide the person
				if (tempSelectedWorld.transform.gameObject.GetComponent(PlanetSearcher).nearestPlanet.transform.gameObject.name == "humanShip")
				{
					dummyChildList[MoveI].gameObject.SetActiveRecursively(false);
				}
			}
			else
			{
				yield StartCoroutine(ReparentChild(dummyChildList[MoveI].gameObject, (-25 * MoveN) + (-25 * MoveDummyNum)));
			}
			MoveN++;
		}
							
		//if the people are moving to the spaceship then add their count to the saved people. Need to know if moving people from an asteroid.
		if (!Asteroid)
		{
			if (tempSelectedWorld.transform.gameObject.GetComponent(PlanetSearcher).nearestPlanet.transform.gameObject.name == "humanShip")
			{
				peopleSaved += MoveN;
				Camera.main.transform.Find("PeopleCounter").GetComponent(PeopleCounter).Increment(MoveN);
			}
		}
		else
		{
			if (tempSelectedWorld.transform.parent.parent.gameObject.GetComponent(AsteroidController).nearestPlanet.transform.gameObject.name == "humanShip")
			{
				peopleSaved += MoveN;
				Camera.main.transform.Find("PeopleCounter").GetComponent(PeopleCounter).Increment(MoveN); 
			}
		}
	}
}

function ReparentChild(fromChild : GameObject, rotOffset : int) //this used to actually reparent the child, until the person movement effect changed, now it creates a new child at the planet. This only needs to know if the object being moved to is an asteroid.
{
	//teleport out 'from' child
	fromChild.GetComponent(HumanPerson).TeleportOut();
	
	//if the selected world is a planet
	if (selectedWorld.collider.name == "HumanPlanet")
	{
		//planet to planet
		if (selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).nearestPlanet.name == "HumanPlanet")
		{
			dummyObj = GameObject.Instantiate(HumanPersonFab, selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).nearestPlanet.transform.position, Quaternion(0,0,0,0));
			dummyObj.transform.position = selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).nearestPlanet.transform.position;
			dummyObj.transform.parent = selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).nearestPlanet.transform;
			dummyObj.GetComponent(HumanPerson).TeleportIn();
			
			//offset the person rotation
			dummyObj.transform.Rotate(0, 0, rotOffset, Space.Self);
			
			//reset person scale
			dummyObj.transform.localScale = Vector3(1,1,1);
		}
	
		//planet to asteroid
		if (selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).nearestPlanet.name == "AsteroidCenter")
		{
			dummyObj = GameObject.Instantiate(HumanPersonFab, selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).nearestPlanet.transform.position, Quaternion(0,0,0,0));
			dummyObj.transform.position = selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).nearestPlanet.transform.position;
			dummyObj.transform.parent = selectedWorld.transform.gameObject.GetComponent(PlanetSearcher).nearestPlanet.transform;
			dummyObj.GetComponent(HumanPerson).TeleportIn();
			
			//offset the person rotation
			dummyObj.transform.Rotate(0, 0, rotOffset, Space.Self);
			
			//reset person scale and rotate up
			dummyObj.transform.localScale = Vector3(1.2,1.2,1.2);
		}
	}
	
	//if the selectedworld is an asteroid
	if (selectedWorld.collider.name == "AsteroidCenter")
	{
		//asteroid to planet
		if (selectedWorld.transform.parent.parent.gameObject.GetComponent(AsteroidController).nearestPlanet.name == "HumanPlanet")
		{
			dummyObj = GameObject.Instantiate(HumanPersonFab, selectedWorld.transform.parent.parent.gameObject.GetComponent(AsteroidController).nearestPlanet.transform.position, Quaternion(0,0,0,0));
			dummyObj.transform.position = selectedWorld.transform.parent.parent.gameObject.GetComponent(AsteroidController).nearestPlanet.transform.position;
			dummyObj.transform.parent = selectedWorld.transform.parent.parent.gameObject.GetComponent(AsteroidController).nearestPlanet.transform;
			dummyObj.GetComponent(HumanPerson).TeleportIn();
			
			//offset the person rotation
			dummyObj.transform.Rotate(0, 0, rotOffset, Space.Self);
			
			//reset person scale
			dummyObj.transform.localScale = Vector3(1,1,1);
		}
		//asteroid to asteroid
		if (selectedWorld.transform.parent.parent.gameObject.GetComponent(AsteroidController).nearestPlanet.name == "AsteroidCenter")
		{
			dummyObj = GameObject.Instantiate(HumanPersonFab, selectedWorld.transform.parent.parent.gameObject.GetComponent(AsteroidController).nearestPlanet.transform.position, Quaternion(0,0,0,0));
			dummyObj.transform.position = selectedWorld.transform.parent.parent.gameObject.GetComponent(AsteroidController).nearestPlanet.transform.position;
			dummyObj.transform.parent = selectedWorld.transform.parent.parent.gameObject.GetComponent(AsteroidController).nearestPlanet.transform;
			dummyObj.GetComponent(HumanPerson).TeleportIn();
			
			//offset the person rotation
			dummyObj.transform.Rotate(0, 0, rotOffset, Space.Self);
			
			//reset person scale
			dummyObj.transform.localScale = Vector3(1.2,1.2,1.2);
		}
	}
	
	//offset each person animation
	yield WaitForSeconds(0.1); 
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
//	if (StarStreakMat.GetColor("_TintColor").a < 0.4)
//	{
//		StarStreakMat.SetColor("_TintColor",Color(StarStreakMat.GetColor("_TintColor").r, StarStreakMat.GetColor("_TintColor").g, StarStreakMat.GetColor("_TintColor").b, StarStreakMat.GetColor("_TintColor").a + 0.013));
//	}
	//TransitionStars.transform.position.z -= 2;
	
	//move the camera in
	levelFinishCamZoomMultiplier += 0.2;
	transform.position.z += CameraPositionSpeed * Time.deltaTime * levelFinishCamZoomMultiplier;
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

//code for settings menu functionality
function SettingsMenu()
{
	halt = true;
	
	if (PlatformPC)
	{
		//selecting level select objects
		if(Input.GetMouseButtonDown(0))
		{
			if(Physics.Raycast(Camera.main.WorldToScreenPoint(Vector3(Input.mousePosition.x,Input.mousePosition.y,Camera.main.transform.position.z)), Camera.main.ScreenToWorldPoint(Vector3(Input.mousePosition.x, Input.mousePosition.y, WorldZDepth - Camera.main.transform.position.z)), objectInfo))
			{
				if (objectInfo.collider.name == "BackArrow")
				{
					tagPressed = true;
					DepressLevelTag(objectInfo, false);
				}	
			}			
		}
		
		//when letting go of the mouse then do stuff
		if (Input.GetMouseButtonUp(0) && tagPressed)
		{
			StopAllCoroutines();
			if (tagPressed)
			{
				UnpressLevelTag(objectInfo, false);
			}
			//reset tag pressed
			tagPressed = false;
			
			//move back to main menu
			nextLevel = true;
			toMainMenu = true;
		}		
	}
	
	//if ios platform
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
				Touch1Tap = true;	
				
				//get start pos
				if (Touch1Start)
				{
					Touch1StartPos = touch.position;
					Touch1Start = false;
					Touch1Move = false;
					
					//check for tag depression
					if(Physics.Raycast(Camera.main.WorldToScreenPoint(Vector3(Touch1StartPos.x,Touch1StartPos.y,Camera.main.transform.position.z)), Camera.main.ScreenToWorldPoint(Vector3(Touch1StartPos.x, Touch1StartPos.y, WorldZDepth - Camera.main.transform.position.z)), objectInfo))
					{
						DepressLevelTag(objectInfo, false);
						depressedTag = objectInfo;
						iosTagDepress = true;
					}
					
				}		
			}
		}
		
		//if not touching
		if (!Touching1)
		{
			//reset
			Touch1Start = true;
			
			//unpress level tag
			if (iosTagDepress)
			{
				iosTagDepress = false;
				UnpressLevelTag(depressedTag, false);
				
				//move back to main menu
				nextLevel = true;
				toMainMenu = true;
			}
		}
	}
}

//code for contact menu functionality
function ContactMenu()
{
	halt = true;
	
	if (PlatformPC)
	{
		//selecting level select objects
		if(Input.GetMouseButtonDown(0))
		{
			if(Physics.Raycast(Camera.main.WorldToScreenPoint(Vector3(Input.mousePosition.x,Input.mousePosition.y,Camera.main.transform.position.z)), Camera.main.ScreenToWorldPoint(Vector3(Input.mousePosition.x, Input.mousePosition.y, WorldZDepth - Camera.main.transform.position.z)), objectInfo))
			{
				if (objectInfo.collider.name == "BackArrow")
				{
					tagPressed = true;
					DepressLevelTag(objectInfo, false);
				}	
			}			
		}
		
		//when letting go of the mouse then do stuff
		if (Input.GetMouseButtonUp(0) && tagPressed)
		{
			StopAllCoroutines();
			if (tagPressed)
			{
				UnpressLevelTag(objectInfo, false);
			}
			//reset tag pressed
			tagPressed = false;
			
			//move back to main menu
			nextLevel = true;
			toMainMenu = true;
		}		
	}
	
	//if ios platform
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
				Touch1Tap = true;	
				
				//get start pos
				if (Touch1Start)
				{
					Touch1StartPos = touch.position;
					Touch1Start = false;
					Touch1Move = false;
					
					//check for tag depression
					if(Physics.Raycast(Camera.main.WorldToScreenPoint(Vector3(Touch1StartPos.x,Touch1StartPos.y,Camera.main.transform.position.z)), Camera.main.ScreenToWorldPoint(Vector3(Touch1StartPos.x, Touch1StartPos.y, WorldZDepth - Camera.main.transform.position.z)), objectInfo))
					{
						DepressLevelTag(objectInfo, false);
						depressedTag = objectInfo;
						iosTagDepress = true;
					}
					
				}		
			}
		}
		
		//if not touching
		if (!Touching1)
		{
			//reset
			Touch1Start = true;
			
			//unpress level tag
			if (iosTagDepress)
			{
				iosTagDepress = false;
				UnpressLevelTag(depressedTag, false);
				
				//move back to main menu
				nextLevel = true;
				toMainMenu = true;
			}
		}
	}
}

//Code for Main Menu functionality
function MainMenu()
{
	halt = true;
	
	//pc controls
	if (PlatformPC)
	{
		//selecting level select objects
		if(Input.GetMouseButtonDown(0))
		{
			if(Physics.Raycast(Camera.main.WorldToScreenPoint(Vector3(Input.mousePosition.x,Input.mousePosition.y,Camera.main.transform.position.z)), Camera.main.ScreenToWorldPoint(Vector3(Input.mousePosition.x, Input.mousePosition.y, WorldZDepth - Camera.main.transform.position.z)), objectInfo))
			{
				if (objectInfo.collider.tag == "LevelTag")
				{
					tagPressed = true;
					DepressLevelTag(objectInfo, false);
				}	
			}			
		}
		
		//when letting go of the mouse then do stuff
		if (Input.GetMouseButtonUp(0) && objectInfo.collider.tag == "LevelTag")
		{
			StopAllCoroutines();
			if (tagPressed)
			{
				UnpressLevelTag(objectInfo, false);
			}
			//reset tag pressed
			tagPressed = false; 
			
			//if clicked the start button
			if (objectInfo.collider.name == "Start")
			{
				nextLevel = true;
				toLevelSelect = true;
				isLevelSelect = false;
				inGame = true;
			}
			
			//if clicked the Settings button
			if (objectInfo.collider.name == "Settings")
			{
				nextLevel = true;
				toSettings = true;
				isLevelSelect = false;
				inGame = false;
			}
			
			//if clicked the Contact button
			if (objectInfo.collider.name == "Contact")
			{				
				print("contact");
				nextLevel = true;
				toContact = true;
				isLevelSelect = false;
				inGame = false;
			}
		}		
	}
	
	//if ios platform
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
				Touch1Tap = true;	
				
				//get start pos
				if (Touch1Start)
				{
					Touch1StartPos = touch.position;
					Touch1Start = false;
					Touch1Move = false;
					
					//check for tag depression
					if(Physics.Raycast(Camera.main.WorldToScreenPoint(Vector3(Touch1StartPos.x,Touch1StartPos.y,Camera.main.transform.position.z)), Camera.main.ScreenToWorldPoint(Vector3(Touch1StartPos.x, Touch1StartPos.y, WorldZDepth - Camera.main.transform.position.z)), objectInfo))
					{
						DepressLevelTag(objectInfo, false);
						depressedTag = objectInfo;
						iosTagDepress = true;
					}
					
				}		
			}
		}
		
		//if not touching
		if (!Touching1)
		{
			//reset
			Touch1Start = true;
			
			//unpress level tag
			if (iosTagDepress)
			{
				iosTagDepress = false;
				UnpressLevelTag(depressedTag, false);
			}
			
			//check a tap			
			if(Physics.Raycast(Camera.main.WorldToScreenPoint(Vector3(Touch1StartPos.x,Touch1StartPos.y,Camera.main.transform.position.z)), Camera.main.ScreenToWorldPoint(Vector3(Touch1StartPos.x, Touch1StartPos.y, WorldZDepth - Camera.main.transform.position.z)), objectInfo))
			{
				//if clicked the start button
				if (objectInfo.collider.name == "Start")
				{
					toLevelSelect = true;
					nextLevel = true;
					isLevelSelect = false;
					inGame = true;
				}
				
				//if clicked the Settings button
				if (objectInfo.collider.name == "Settings")
				{
					toSettings = true;
					nextLevel = true;
					isLevelSelect = false;
					inGame = true;
				}
				
				//if clicked the Contact button
				if (objectInfo.collider.name == "Contact")
				{				
					toContact = true;
					nextLevel = true;					
					isLevelSelect = false;
					inGame = true;
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
				//if clicked a level tag
				if (objectInfo.collider.tag == "LevelTag")
				{
					//print(objectInfo.collider.name);					
					if (objectInfo.collider.name == "boss level - 900,000")
					{
						if (!camera.main.GetComponent(KeyLockingController).Locked)
						{
							tagPressed = true;
							DepressLevelTag(objectInfo, true);
						}
						else
						{
							print("locked");
						}
					}
					else
					{
						tagPressed = true;
						DepressLevelTag(objectInfo, true);
					}
				}
				
				if (objectInfo.collider.name == "BackArrow")
				{
					tagPressed = true;
					DepressLevelTag(objectInfo, false);
				}
			}
		}
		
		//when letting go of the mouse then do stuff
		if (Input.GetMouseButtonUp(0) && tagPressed)
		{
			StopAllCoroutines();
			if (tagPressed)
			{
				UnpressLevelTag(objectInfo, true);
			}
			//reset tag pressed
			tagPressed = false; 
			 
			//back arrow
			if (objectInfo.collider.name == "BackArrow")
			{
				nextLevel = true;
				toMainMenu = true;
			} 
			
			if (objectInfo.collider.tag == "LevelTag")
			{
				//check boss level
				if (objectInfo.collider.transform.Find("Num").GetComponent(TextMesh).text == "BOSS LEVEL")
				{
					if (!this.GetComponent(KeyLockingController).Locked)
					{
						FadeOutKeys(); //fade out keys
						
						//initialize information for next go around
						previousLevel = 20;
						Level = objectInfo.collider.name;
						PrevLevelLoc = LevelSelectMovementController.transform.position;
						LevelOffset = Vector3.zero;
						nextLevel = true;
						toLevel = true;
						isLevelSelect = false;
						//isMenu = false;
						inGame = true;
						fromLSelect = true;
					}
					else
					{
						print("locked");
					}
				}
				else //if not boss level then load like a normal level
				{
					FadeOutKeys(); //fade out keys
					
					//Level is set to the collider's name and then loaded. See "nextLevel" code in update function.
					previousLevel = int.Parse(objectInfo.collider.transform.Find("Num").GetComponent(TextMesh).text);
					Level = objectInfo.collider.name;
					PrevLevelLoc = LevelSelectMovementController.transform.position;
					LevelOffset = Vector3.zero;
					nextLevel = true;
					toLevel = true;
					isLevelSelect = false;
					//isMenu = false;
					inGame = true;
					fromLSelect = true;
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
					
					//check for tag depression
					if(Physics.Raycast(Camera.main.WorldToScreenPoint(Vector3(Touch1StartPos.x,Touch1StartPos.y,Camera.main.transform.position.z)), Camera.main.ScreenToWorldPoint(Vector3(Touch1StartPos.x, Touch1StartPos.y, WorldZDepth - Camera.main.transform.position.z)), objectInfo))
					{
						FadeKick = false;
						DepressLevelTag(objectInfo, true);
						depressedTag = objectInfo;
						iosTagDepress = true;
					}
					
				}
				//check if a tap, if not then a drag
				if ((Touch1StartPos.x + TouchTapBounds.x > Touch1EndPos.x) && (Touch1StartPos.x - TouchTapBounds.x < Touch1EndPos.x) && (Touch1StartPos.y + TouchTapBounds.y > Touch1EndPos.y) && (Touch1StartPos.y - TouchTapBounds.y < Touch1EndPos.y))
				{
					Touch1Tap = true;
				}
				else if (Touch1StartPos.y < 250) //if a move and on the bottom half of the screen
				{
					//unpress level tag
					if (iosTagDepress)
					{
						iosTagDepress = false;
						UnpressLevelTag(depressedTag, true);
					}
							
					Touch1Move = true;
					Touch1Tap = false;
					 
					MovementControllerOldPos = LevelOffset;
					//limit movement 
					if (LevelSelectMovementController.transform.position.x + (touch.deltaPosition.x * Time.deltaTime) * LevelSelectDragRate < 0) //left side 
					{ 
						LevelOffset.x += (touch.deltaPosition.x * Time.deltaTime) * LevelSelectDragRate;
					}
					else 
					{ 
						LevelOffset.x = 0; 
						return; //then kick out
					}
					if (LevelSelectMovementController.transform.position.x + (touch.deltaPosition.x * Time.deltaTime) * LevelSelectDragRate > -146) //right side
					{ 
						LevelOffset.x += (touch.deltaPosition.x * Time.deltaTime) * LevelSelectDragRate;
					}
					else 
					{
						LevelOffset.x += -146; 
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
			
			//unpress level tag
			if (iosTagDepress)
			{				
				UnpressLevelTag(depressedTag, true);
				
				//check back arrow before anything else
				if (objectInfo.collider.name == "BackArrow")
				{
					nextLevel = true;
					toMainMenu = true;
					return;
				}
				
				iosTagDepress = false;
				FadeKick = true;
			}
			
			//check flicking
			if (Touch1Move)
			{				
				//limit movement
				if (LevelOffset.x - Movement1Delta.x < 0) //left side
				{ 
					LevelOffset.x -= (Movement1Delta.x);
				}
				else
				{
					//end the flick
					LevelOffset.x = 0;
					
					Touch1StartPos = Vector2(0,0);
					Touch1EndPos = Vector2(1000,1000);		
					Movement1Delta.x = 0;
					Touch1Move = false;
				}
				if (LevelOffset.x - Movement1Delta.x > -146) //right side 
				{
					LevelOffset.x -= (Movement1Delta.x); 
				}
				else
				{
					//end the flick
					print("limiting and ending the flick");
					LevelOffset.x = -146;
					
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
					if (objectInfo.collider.tag != "key")
					{
						FadeOutKeys(); //fade out keys
						
						//save level offset
						leveloffsetX = LevelOffset.x;
						leveloffsetY = LevelOffset.y;
						leveloffsetZ = LevelOffset.z;
						
						//Level is set to the collider's name and then loaded. See "nextLevel" code in update function.
						previousLevel = int.Parse(objectInfo.collider.transform.Find("Num").GetComponent(TextMesh).text);
						Level = objectInfo.collider.name;
						nextLevel = true;
						toLevel = true;
						isLevelSelect = false;
						//isMenu = false;
						inGame = true;
						fromLSelect = true;
						
						//Goes back to main menu	
						if(objectInfo.collider.name == "mainmenu")
						{
							Application.LoadLevel("mainmenu");
							isLevelSelect = false;
							//isMenu = true;
						}
						
						Touch1Tap = false;
						Touch1StartPos = Vector2(0,0);
						Touch1EndPos = Vector2(1000,1000);
					}
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
	if (isSettingsMenu)
	{
		//world dragging inverting toggle
		WorldDraggingInverted = GUI.Toggle(Rect(280,250,200,30), WorldDraggingInverted, "Invert View Dragging");
		
		//tilt speed
		this.GetComponent(TiltControls).Speed = GUI.HorizontalSlider (Rect (280, 300, 100, 30), this.GetComponent(TiltControls).Speed, 20.0, 50.0);
	}
	
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
	if (canMoveToWorld)
	{
		LevelPaused = true;
		CanZoom = false;
		
		//zoom streaks
		//ZoomStreaks.GetComponent(ZoomStarStreaks).MoveToPlanets();
		
		canMoveToWorld = false;
		canMoveToPlay = true;
		
		cameraZoomInPos = transform.position;
		cameraZoomInPos.z = CameraLocDepth;
		
		//type in pause text
		PausePlane.GetComponent(TextTypeEffect).ParentCheck = false;
		PausePlane.GetComponent(TextTypeEffect).Done = false;
		PausePlane.GetComponent(TextTypeEffect).TextToType = "PAUSED";
		
		//move out camera
		yield StartCoroutine(MoveTo(0.2,CameraZoomOutPos));
		tapCount = 0;
	}
}

//zoom world in and play everything. go to play view. PinchOut
function MoveToPlayView()
{	
	if (canMoveToPlay)
	{
		LevelPaused = false;
		CanZoom = true;
		
		//zoom streaks
		//ZoomStreaks.GetComponent(ZoomStarStreaks).MoveAwayFromPlanets();
		
		canMoveToPlay = false;
		canMoveToWorld = true;
		
		//type away pause text
		PausePlane.GetComponent(TextTypeEffect).Done = false;
		PausePlane.GetComponent(TextTypeEffect).TextToType = " ";
		
		//move in camera
		yield StartCoroutine(MoveTo(0.2,cameraZoomInPos));
		tapCount = 0;
	}
}

//push the camera around when dragging planets
function CameraViewPlanetPushing()
{
	//pc controls
	if (PlatformPC)
	{
		if (worldSelected && !LevelPaused)
		{
			//get view coordinates
			dummyVector2 = Camera.main.WorldToScreenPoint(selectedWorld.transform.position);
			
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
	FailType.GetComponent(TextTypeEffect).Type("LEVEL FAIL");
	
	yield WaitForSeconds(1.5);
	
	//type fail text
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
		
		//wait a bit
		toLevelSelect = true;
		yield WaitForSeconds(1);
		
		//start level winning type
		FailType.GetComponent(TextTypeEffect).ParentCheck = false;
		FailType.GetComponent(TextTypeEffect).TextToType = "COMPLETED";
		FailType.GetComponent(TextTypeEffect).Done = false;
		FailType.transform.parent = null; //unparent
	}
}
 
//translate something over time to target
function MoveTo(time : float, target : Vector3)
{
	//set rates and get start time
	xRate = (target.x - transform.position.x) / (time);
	yRate = (target.y - transform.position.y) / (time);
	zRate = (target.z - transform.position.z) / (time);
	cont = true;
	
	//move stuff
	if (transform.position.z > target.z) //zooming out to world view
	{
		do
		{
			if ((transform.position.z + (zRate * Time.deltaTime)) < target.z)
			{
				cont = false;
			}
			else
			{
				transform.position.x += xRate * Time.deltaTime;
				transform.position.y += yRate * Time.deltaTime;
				transform.position.z += zRate * Time.deltaTime;
			}
			yield;
		} while (cont);
		transform.position = target;
		return;
	}
	if (transform.position.z < target.z) //zooming in to play view
	{
		do
		{
			if ((transform.position.z + (zRate * Time.deltaTime)) > target.z)
			{
				cont = false;
			}
			else
			{
				transform.position.x += xRate * Time.deltaTime;
				transform.position.y += yRate * Time.deltaTime;
				transform.position.z += zRate * Time.deltaTime;
			}
			yield;
		} while (cont);
		transform.position = target;
		return;
	}
}

//depress a level tag
function DepressLevelTag(info : RaycastHit, isLevelTag : boolean) 
{
	if (info.collider.tag == "LevelTag")
	{
		FadeLevelTagSize(info.collider.transform.localScale.x); //fade tag size
		
		//here we do the things that pertain only to the level tags. yeah I know the method name is depress level tag, sue me
		if (isLevelTag)
		{
			info.collider.transform.Find("Num").renderer.material.color.a = 0.4; //number
			info.collider.transform.Find("Name").renderer.material.color.a = 0.4; //name
			info.collider.transform.Find("CompletedPlane").renderer.material.color.a = 0.4; //completed plane
		}
		
		//things to do when not depressing a level tag... aka when doing something in the main menu
		if (!isLevelTag)
		{
			info.collider.transform.Find("text").renderer.material.color.a = 0.4;
		}
	}
	
	//back arrow
	if (info.collider.name == "BackArrow")
	{
		FadeLevelTagSize(info.collider.transform.localScale.x); //fade tag size
		//info.collider.renderer.material.color.a = 0.4; //fade opacity
	}
}

//unpress a level tag. set it back to its normal state
function UnpressLevelTag(info : RaycastHit, isLevelTag : boolean) 
{
	if (info.collider.tag == "LevelTag")
	{		
		//here we do the things that pertain only to the level tags. yeah I know the method name is depress level tag, sue me
		if (isLevelTag)
		{
			info.collider.transform.localScale = Vector3(2.0, 2.0, 1.0); //tag scale
			info.collider.transform.Find("Num").renderer.material.color.a = 1; //number
			info.collider.transform.Find("Name").renderer.material.color.a = 1; //name
			info.collider.transform.Find("CompletedPlane").renderer.material.color.a = 1; //completed plane
		}
		
		//things to do when not depressing a level tag... aka when doing something in the main menu
		if (!isLevelTag)
		{
			info.collider.transform.localScale = Vector3(1.0, 1.0, 1.0); //tag scale
			info.collider.transform.Find("text").renderer.material.color.a = 1;
		}
	}
	
	//back arrow
	if (info.collider.name == "BackArrow")
	{
		info.collider.transform.localScale = Vector3(0.4, 0.4, 0.4); //tag scale
	}
}

function FadeLevelTagSize(startSize : float)
{
	do
	{
		objectInfo.collider.transform.localScale = Vector3(objectInfo.collider.transform.localScale.x - 0.05, objectInfo.collider.transform.localScale.y - 0.05, objectInfo.collider.transform.localScale.z - 0.05); //tag scale 
		yield;
	} while (objectInfo.collider.transform.localScale.x > startSize - 0.15 && !Touch1Move && !FadeKick);
}

//wait and then reset tap count
function TapResetWait()
{
	yield WaitForSeconds (tapTimeLimit);
	tapCount = 0;
}