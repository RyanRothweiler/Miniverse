Shader "Shaders/RampRim" 
{
	Properties 
	{
		_ColorTint("Color Tint", Color) = (1,1,1,1)
		
		_MainTex ("Main Texture", 2D) = "white"{}
		_Ramp ("Shading Ramp", 2D) = "white"{}
		
		_RimColor("Rim Color", Color) = (1,1,1,1)
		_RimPower("Rim Power", Range(0.5, 8.0)) = 3.0
	}
	
	SubShader 
	{
		Tags { "RenderType"="Opaque" }		
		CGPROGRAM
		#pragma surface surf CustomDiffuse
		
		
		//my properties
		float4 _RimColor;
		float _RimPower;
		
		float4 _ColorTint;
		sampler2D _MainTex;
		sampler2D _Ramp;
		
			
		half4 LightingCustomDiffuse(SurfaceOutput s, half3 lightDir, half atten)
		{
			//ramp lighting
			half NdotL = dot(s.Normal, lightDir);
			half diff = NdotL * 0.5 + 0.5;
			half3 ramp = tex2D(_Ramp, float2(diff)).rgb;
			half4 c;
			
			c.rgb = s.Albedo * _LightColor0.rgb * (ramp * atten * 2);
			c.a = s.Alpha;
			return c;
		}

		struct Input 
		{
			float4 color: Color;
			float2 uv_MainTex;
			float3 viewDir;
		};
		

		void surf (Input IN, inout SurfaceOutput o) 
		{
			IN.color = _ColorTint;
			o.Albedo = tex2D(_MainTex, IN.uv_MainTex).rgb * IN.color;
			
			half rim = 1.0 - saturate(dot(normalize(IN.viewDir), o.Normal));			
			o.Emission = _RimColor.rbg * pow(rim, _RimPower);
			
		}
		
		ENDCG
	} 
	Fallback "Diffuse"
}
