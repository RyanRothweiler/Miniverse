#pragma strict

var destSelf : boolean; //initiate destruction
var primeFuse : boolean; //will it destruct on next click
var chilNum : int; //number of childs
var humNum : boolean; //number of humans
var i : int;


function Start ()
{
	destSelf = false;
	primeFuse = false;
	humNum = false;
	chilNum = transform.childCount;
}

function Update ()
{

	if(chilNum != transform.childCount)
	{
		primeFuse = true;
	}
	

	if(chilNum == transform.childCount && primeFuse)
	{
		Destroy();
	}
}

function Destroy()
{
	transform.localPosition = Vector3(1000,1000,1000);
	//Insert destruction animations right here
	yield WaitForSeconds(.25);
	Destroy(gameObject);
}