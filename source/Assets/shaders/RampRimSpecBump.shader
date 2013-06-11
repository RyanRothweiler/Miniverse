Shader "Shaders/RampRimSpecBump" 
{
	Properties 
	{
		_ColorTint("Color Tint", Color) = (1,1,1,1)
		
		_SpecColor("Specular Color", Color) = (1,1,1,1)
		_Shininess("Specular Power", Range(-1,2)) = 0.5
		
		_MainTex ("Main Texture", 2D) = "white"{}
		_BumpMap ("Normal Map", 2D) = "bump"{}
		_Ramp ("Shading Ramp", 2D) = "white"{}
		_SpecMap ("Specular Map", 2D) = "white"{}
		
		_RimColor("Rim Color", Color) = (1,1,1,1)
		_RimPower("Rim Power", Range(0.5, 8.0)) = 3.0
		
		_Cube("Cube Map", CUBE) = "" {}
	}
	
	SubShader 
	{
		Tags { "RenderType"="Opaque" }
		LOD 400	
		CGPROGRAM
		#pragma surface surf CustomDiffuse
		
		
		//my properties
		float4 _RimColor;
		float _RimPower;
		float _Shininess;
		
		float4 _ColorTint;
		sampler2D _MainTex;
		sampler2D _BumpMap;
		sampler2D _Ramp;
		sampler2D _SpecMap;
		samplerCUBE _Cube;
		
			
		half4 LightingCustomDiffuse(SurfaceOutput s, half3 lightDir, half3 viewDir, half atten)
		{
			//ramp lighting
			half NdotL = dot(s.Normal, lightDir);
			half diff = NdotL * 0.5 + 0.5;
			half3 ramp = tex2D(_Ramp, float2(diff)).rgb;
			
			//specular
			fixed diff_spec = max (0, dot (s.Normal, lightDir));
			half3 h = normalize (lightDir + viewDir);
			float nh = max (0, dot (s.Normal, h));
			float spec = pow (nh, s.Specular * 128.0) * s.Gloss;
			
			fixed4 c;
			c.rgb = (s.Albedo * _LightColor0.rgb * diff_spec +  _SpecColor.rgb * spec) * (ramp * atten * 2);
			c.a = s.Alpha + _LightColor0.a * _SpecColor.a * spec * atten;
			return c;
		}

		struct Input 
		{
			float4 color: Color;
			float2 uv_MainTex;
			float2 uv_BumpMap;
			float2 uv_SpecMap;
			float3 viewDir;
			float3 worldRefl;
			INTERNAL_DATA
		};
		

		void surf (Input IN, inout SurfaceOutput o) 
		{
			IN.color = _ColorTint;
			fixed4 tex = tex2D(_MainTex, IN.uv_MainTex);
			o.Albedo = tex2D(_MainTex, IN.uv_MainTex).rgb * IN.color;
			//o.Emission = texCube(_Cube, IN.worldRefl).rgb;
			
			//normal
			o.Normal = UnpackNormal(tex2D(_BumpMap, IN.uv_BumpMap));
			
			//specular			
			o.Specular = _Shininess;
			o.Gloss = tex.a;
			o.Gloss = tex2D(_SpecMap, IN.uv_SpecMap).rgb;
			
			half rim = 1.0 - saturate(dot(normalize(IN.viewDir), o.Normal));			
			o.Emission = (_RimColor.rgb * pow(rim, _RimPower));
			
		}
		
		ENDCG
	} 
	Fallback "Diffuse"
}
