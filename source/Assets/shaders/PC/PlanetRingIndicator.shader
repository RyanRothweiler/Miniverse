Shader "Shaders/PlanetRingIndicator" {
	Properties 
	{
		_MainColor("Main Color", Color) = (1,1,1,1)
	}
	SubShader {
		//Ztest Always
		Tags {"Queue"="Transparent" "RenderType"="Opaque"}	
		LOD 200
		
		CGPROGRAM
		#pragma surface surf CustomDiffuse
		
		float4 _MainColor;
		
		half4 LightingCustomDiffuse(SurfaceOutput s, half3 lightDir, half atten)
		{
			return _MainColor;
		}
		
		struct Input 
		{
			float4 color: Color;
		};

		void surf (Input IN, inout SurfaceOutput o) 
		{
			IN.color = _MainColor;
			o.Albedo = IN.color;
			o.Alpha = 0;
		}
		ENDCG
	} 
	FallBack "Diffuse"
}
