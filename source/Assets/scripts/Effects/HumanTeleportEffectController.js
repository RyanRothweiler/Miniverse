#pragma strict

//public vars

//private vars
private var DragControls : DragControlsPC; //the master drag controls script
private var ParticleMat : Material; //the material used for the particles

function Start () 
{
	//get drag controls script
	DragControls = Camera.main.GetComponent(DragControlsPC);
	
	//get particle mat and hide it
	ParticleMat = transform.Find("humanPerson_teleport_MO/Particle System").renderer.material;
	ParticleMat.SetColor("_TintColor", Color(ParticleMat.GetColor("_TintColor").r, ParticleMat.GetColor("_TintColor").g, ParticleMat.GetColor("_TintColor").b, 0));
}

function Awake()
{
	//get drag controls script
	DragControls = Camera.main.GetComponent(DragControlsPC);
	
	//get particle mat
	ParticleMat = transform.Find("humanPerson_teleport_MO/Particle System").renderer.material;
	ParticleMat.SetColor("_TintColor", Color(ParticleMat.GetColor("_TintColor").r, ParticleMat.GetColor("_TintColor").g, ParticleMat.GetColor("_TintColor").b, 1));
}

function Update () 
{	
}

function Teleport()
{
	//show particles
	ParticleMat.SetColor("_TintColor", Color(ParticleMat.GetColor("_TintColor").r, ParticleMat.GetColor("_TintColor").g, ParticleMat.GetColor("_TintColor").b, 1));
	
	//start anim
	transform.GetChild(0).animation["Default Take"].speed = 4;
	transform.GetChild(0).animation.Play();
	
	//wait and then hide particles
	yield WaitForSeconds(0.13);
	ParticleMat.SetColor("_TintColor", Color(ParticleMat.GetColor("_TintColor").r, ParticleMat.GetColor("_TintColor").g, ParticleMat.GetColor("_TintColor").b, 0));
}

function ShowMat()
{
	ParticleMat.SetColor("_TintColor", Color(ParticleMat.GetColor("_TintColor").r, ParticleMat.GetColor("_TintColor").g, ParticleMat.GetColor("_TintColor").b, 1));
}

function HideMat()
{
	ParticleMat.SetColor("_TintColor", Color(ParticleMat.GetColor("_TintColor").r, ParticleMat.GetColor("_TintColor").g, ParticleMat.GetColor("_TintColor").b, 0));
}