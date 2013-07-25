#pragma strict

//public vars
public var time : float;

function Start () 
{
	wait();
}

function Update () 
{

}

function wait()
{
	yield WaitForSeconds(time);
	Destroy(this.gameObject);
}