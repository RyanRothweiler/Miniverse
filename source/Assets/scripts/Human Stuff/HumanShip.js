#pragma strict

//public vars
public var FlameEffect : GameObject;
public var FlameSmokeEffect : GameObject;

//private var
private var oldPos : Vector3;
private var DragControls : DragControlsPC;
private var introDone = false;
private var idleStart = false;
private var switchStart = false;
private var i : int;
private var cont = true;

function Start () 
{
	//hide ship
	HideShip();
	
	//setup particle effects
	FlameSmokeEffect.GetComponent(ParticleSystem).enableEmission = false;
	
	//set up anim
	animation["Intro"].speed = 0;
	animation.Play("Intro");
	
	//get drag controls script
	DragControls = Camera.main.GetComponent(DragControlsPC);
}

function Update () 
{
	//animation pausing
//	if (!DragControls.LevelPaused)
//	{
//		animation["Idle"].speed = 1;
//	}
//	else
//	{
//		animation["Idle"].speed = 0;
//	}

	//idle
	if (animation["Intro"].time > 4.5 && !idleStart)
	{
		SwitchParticles();
		idleStart = true;
		FadeInIdle();
		animation["Idle"].speed = 0;
		animation.Play("Idle");
	}
	
	//intro
	if (transform.parent.parent == null && !introDone)
	{
		ShowShip();
		introDone = true;
		animation.Play("Intro");
		animation["Intro"].speed = 2;
	}
	
	//switch particles
	if (animation["Intro"].time > 3.5 && !switchStart)
	{
		SwitchParticles();
		switchStart = true;
	}
	
	//flying away
	if (DragControls.FlyAway)
	{
		FlyAway();
	}
}

function FadeInIdle()
{
	yield WaitForSeconds(1);
	do
	{
		animation["Idle"].speed += 0.25 * Time.deltaTime;
		yield;
	} while (animation["Idle"].speed <= 1);
}

function SwitchParticles()
{
	FlameSmokeEffect.GetComponent(ParticleSystem).enableEmission = true; //enable smoke
	do
	{
		//FlameEffect.GetComponent(ParticleSystem).renderer.material.GetColor("_TintColor").a -= 1000 * Time.deltaTime; //fade out material
		FlameEffect.GetComponent(ParticleSystem).startSpeed -= 4 * Time.deltaTime; //pull flame toward ship
		yield;
	} while (FlameEffect.GetComponent(ParticleSystem).startSpeed > 5);
	FlameEffect.GetComponent(ParticleSystem).enableEmission = false; //disable flames
}

function FlyAway()
{
	//start fire
	FlameEffect.GetComponent(ParticleSystem).enableEmission = true; //enable flames
	FlameEffect.GetComponent(ParticleSystem).startSpeed  = 7; //enable flames
	
	yield WaitForSeconds(0.2);
	FlameSmokeEffect.GetComponent(ParticleSystem).renderer.enabled = false; //disable smoke
	FlameSmokeEffect.GetComponent(ParticleSystem).enableEmission = false; 
	
	animation["Outro"].speed = 2;
	animation.CrossFade("Outro");
	ScaleDownFlames();
	CheckShipSize();

	yield WaitForSeconds(2);
	
	DragControls.SetNextLevel();
}

function CheckShipSize()
{
	do
	{
		if (animation["Outro"].time > 3.8)
		{
			transform.parent.localPosition = Vector3(1000,1000,1000);
		}
		else
		{
			cont = false;
		}
		yield;
	} while(cont);
}

function ScaleDownFlames()
{
	do
	{
		FlameEffect.GetComponent(ParticleSystem).startSize -= 0.01 * Time.deltaTime;
		yield;
	} while (FlameEffect.GetComponent(ParticleSystem).startSize > 0);
}

function HideShip()
{
	this.renderer.enabled = false;
	FlameEffect.renderer.enabled = false;
	FlameSmokeEffect.renderer.enabled = false;
}

function ShowShip()
{
	this.renderer.enabled = true;
	FlameEffect.renderer.enabled = true;
	FlameSmokeEffect.renderer.enabled = true;
}