/*Just an early iteration of this, this will make it so we can keep code separate eachother.
For instance, if someone is playing on an iPad the code for Computers won't run and Visa Versa
which should increase performance ever so slightly. Itll also make it so we can adjust the screen
resolution, graphics, and other shinanigans according to the intended platform.

7/20::Devon - Added
*/
function Start()
{
	if(Application.platform == RuntimePlatform.WindowsPlayer)
	{
		Debug.Log("IT FUCKIN WURKS BITCHESSS");
	}
}
