#pragma strict

//public vars
public var LevelName : String;
public var bestTime : float; //holds the best time for this level
//public var guiInfo : GUIStyle;
//public var LevelNum : TextMesh;

//private vars
private var dummyRect : Rect;
private var fadeSpeed = 1.8;

function Start () 
{
	//guiInfo.normal.textColor.a = 0;
}

function Update () 
{
//	//fade in the level information
//	if (transform.parent.parent == null && guiInfo.normal.textColor.a <= 1)
//	{
//		print("fading");
//		guiInfo.normal.textColor.a += fadeSpeed * Time.deltaTime;
//	}

}

function OnGUI()
{
//	if (Camera.main.gameObject.GetComponent(DragControlsPC).isLevelSelect)
//	{
//		dummyRect = Rect(Camera.main.WorldToScreenPoint(transform.position).x, Camera.main.pixelHeight - Camera.main.WorldToScreenPoint(transform.position).y, 256, 256);
//		GUI.Label(Rect(dummyRect.x - (dummyRect.width / 2), dummyRect.y - (dummyRect.height / 2), dummyRect.width, dummyRect.height), "DERP", guiInfo);
//	}
}