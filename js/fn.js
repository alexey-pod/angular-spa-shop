(function() {
	'use strict';

	window.fn={};
	
	fn.numeric_format=numeric_format;
	
	function numeric_format(val, thSep, dcSep)	 {
		
		if(val==undefined){
			return '';
		}
		
		if (!thSep) thSep = ' ';
	 
		if (!dcSep) dcSep = ',';
	 
		var res = val.toString();
		var lZero = (val < 0); 
	
		var fLen = res.lastIndexOf('.'); 
		fLen = (fLen > -1) ? fLen : res.length;
	 
		var tmpRes = res.substring(fLen);
		var cnt = -1;
		for (var ind = fLen; ind > 0; ind--) {
			cnt++;
			if (((cnt % 3) === 0) && (ind !== fLen) && (!lZero || (ind > 1))) {
				tmpRes = thSep + tmpRes;
			}
			tmpRes = res.charAt(ind - 1) + tmpRes;
		}
	 
		return tmpRes.replace('.', dcSep);
	 
	}
	
})();