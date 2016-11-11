import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../ui/layout.js';
import '../ui/map.js';
import '../ui/signup.js'
import '../ui/signin.js'



FlowRouter.route('/',{
	name: 'layout',
  	action() {
    	BlazeLayout.render('layout',{main:'map'});
  	},
});

FlowRouter.route('/signup',{
	name: 'signup',
	action(){
		BlazeLayout.render('signup',{main:'signup'})
	},
});

FlowRouter.route('/signin',{
	name: 'signin',
	action(){
		BlazeLayout.render('signin',{main:'signin'})
	},
});
