#pragma strict

//public vars
public var Direction : Vector3;
public var Anim : GameObject;
public var Phase : int; //the phase which this asteroid belongs to

//private vars
private var start = true;	
private var Going = false;

function Start () 
{
	//randomize animation
	Anim.animation["Default Take"].time = Random.Range(0,50);
	Anim.animation["Default Take"].speed = Random.Range(-2.0,2.0);
	
	//fix rotation of particles
	if (Phase == 2)
		GetComponentInChildren(ParticleSystem).startRotation = 80;
}

function Update () 
{
	//set going. Don't go until the planet has been clicked
	if (Camera.main.GetComponent(DragControlsPC).AutoMoving)
		Going = true;
		
	//if not parented to anything
	if (transform.parent == null && Going)
	{
		//set kinematic on 'start'
		if (start)
		{
			start = false;
			rigidbody.isKinematic = true;
		}
		
		//move asteroid
		if (Phase == 1 && Camera.main.GetComponent(DragControlsPC).Phase1)
			transform.position += Direction * Time.deltaTime;
		if (Phase == 2 && Camera.main.GetComponent(DragControlsPC).Phase2)
			transform.position += Direction * Time.deltaTime;
		if (Phase == 3 && Camera.main.GetComponent(DragControlsPC).Phase3)
			transform.position += Direction * Time.deltaTime;
	}
}