#pragma strict

//public vars
public var Locked : boolean;

//private var
private var keys : GameObject[];
private var i : int;
private var matedCount : int;
private var keypiece : KeyPiece;

function Start () 
{
	//init
	Locked = true;
	matedCount = 0; 
	
	//get keys
	keys = 	GameObject.FindGameObjectsWithTag("key");
}

function Update () 
{
	matedCount = 0;
	//check
	for (i = 0; i < keys.Length; i++)
	{
		keypiece = keys[i].GetComponent(KeyPiece);
		if (keypiece.Mated1 && keypiece.Mated2 && keypiece.Mated3 && keypiece.Mated4)
		{
			matedCount++;
		}
	}
	if (matedCount == 20)
	{
		Locked = false;
	}
}