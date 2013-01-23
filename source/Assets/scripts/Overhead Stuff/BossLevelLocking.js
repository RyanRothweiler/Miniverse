#pragma strict

//public vars
public var Locked : boolean;

//private vars
private var keyLock : KeyLockingController;

function Start () 
{
	//init
	Locked = true;
	keyLock = Camera.main.camera.GetComponent(KeyLockingController);
}

function Update () 
{
	//check locking
	if (!keyLock.Locked)
	{
		Locked = false;
		
		//turn off lock texture
		transform.GetChild(0).GetChild(0).renderer.active = false;
	}
}