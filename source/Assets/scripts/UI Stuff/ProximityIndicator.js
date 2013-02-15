#pragma strict

//public vars 
public var CircleMaterial : Material;
public var InnerCircle : GameObject;
public var OuterCircle : GameObject;
public var Arrow : GameObject;
public var AnimSpeed = 7.5;

//private vars
public var Hiding = false;
private var virgin = true;
private var dragControls : DragControlsPC;
private var finalHid = false;

function Start () 
{
	//get drag controls
	dragControls = Camera.main.GetComponent(DragControlsPC);
	 
	//initialize animation stuff
	animation["Anim"].wrapMode = WrapMode.Once;
	CircleMaterial.SetColor("_TintColor", Color(0,1,0,0));
	Show();
}

function Update () 
{

	if (Hiding && animation["Anim"].time == 0)
	{
		InnerCircle.renderer.enabled = false;
		OuterCircle.renderer.enabled = false;
		Arrow.renderer.enabled = false;
	}
	
	//if level beat then clean up
	if (dragControls.levelWon && !finalHid)
	{
		finalHid = true;
		Hide();
	}
}

function Hide()
{
	animation["Anim"].speed = AnimSpeed * -1;
	animation["Anim"].time = 2.5;
	
	animation.Play("Anim");	
	
	Hiding = true;
}

function Show()
{
	if (!virgin)
	{
		CircleMaterial.SetColor("_TintColor", Color(0,1,0,1));
		InnerCircle.renderer.enabled = true;
		OuterCircle.renderer.enabled = true;
		Arrow.renderer.enabled = true;
	}
	else
	{
		virgin = false;
	}
	
	animation["Anim"].speed = AnimSpeed;
	animation.Play("Anim");
	
	Hiding = false;
}