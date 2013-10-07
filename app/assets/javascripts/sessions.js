
function initUserForm(){

	function setToLogIn(){
		loginform = document.getElementById('logIn');
		signupform = document.getElementById('signUp');
		
		loginform.setAttribute('style', 'display:block;');
		signupform.setAttribute('style', 'display:none;')
		
		console.log(loginform);
		console.log(signupform);
	}

	function setToSignUp(){
		loginform = document.getElementById('logIn');
		signupform = document.getElementById('signUp');	
		
		loginform.setAttribute('style', 'display:none;');
		signupform.setAttribute('style', 'display:block;')
		
		console.log(loginform);
		console.log(signupform);
	}

}

if(document.addEventListener){
	document.addEventListener('load', initUserForm());
}else{
	document.attachEvent('load', initUserForm());
}
