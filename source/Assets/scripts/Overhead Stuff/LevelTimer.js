#pragma strict

//public vars
public static var times = new Array(20);

//private vars
private var startTime : float;
private var accumTime : float;
private var TimerStarted = false;
private var levelDone = false;

function Start () 
{
	//init
	accumTime = 0.0;
}

function Update () 
{

}

function StartTimer()
{
	if (!TimerStarted)
	{
		TimerStarted = true;
		startTime = Time.time;
	}
}

function GetTime() : float 
{	
    return(Mathf.Abs((startTime - Time.time) + accumTime));
}

function GetBestTime(num : int) : String
{
	if (times[num] != null)
	{
		return times[num].ToString();
	}
	else
	{
		return "0.00";
	}
}

function LevelDone(levelNum : int)
{
	if (!levelDone)
	{
		times[levelNum - 1] = Mathf.Abs((startTime - Time.time) + accumTime);
		levelDone = true;
	}
}

function Pause()
{
	TimerStarted = false;
	accumTime = startTime - Time.time;
}