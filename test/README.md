stackmob-js-sdk
===============


# StackMob's Javascript SDK Test Suite

This directory contains a handful of Jasmine tests to that you can run against any of our supported JavaScript frameworks (jQuery, Zepto, Sencha).  There are additional requirements for a few of the test suites.

## Requirements
### Initialize the StackMob JS SDK

[Initialize the StackMob JS SDK](https://developer.stackmob.com/sdks/js/config) within the test suite of your choice:

test/specs-jquery.html  
test/specs-sencha.html  
test/specs-zepto.html

### ACL

#### Schema names and their respective CRUD permissions

**perm_logged_in_any** - Allow to any logged in user  
**perm_logged_in_owner** - Allow to sm_owner (object owner)  
**perm_logged_in_relationship** - Allow to `collaborators` relationship  
**perm_logged_in_role** Allow to `some_role` role  
**perm_not_allowed** - Not allowed  
**perm_open** - Open  
**perm_private_key** - Allow with Private Key  

### Users

username: "acl_any", password: "acl_password"  
username: "acl_private", password: "acl_password"  
username: "acl_owner", password: "acl_password"  
username: "acl_role", password: "acl_password", role: "some_role"  
username: "acl_relationship", password: "acl_password"  

### Custom Code

Custom code service named `no_param` that returns the following results

##### GET
```
    { "verb": "GET" }
```
##### POST
```
    { "verb": "POST" }
```
##### PUT
```
    { "verb": "PUT" }
```
##### DELETE
```
    { "verb": "DELETE" }
```
### Run with the StackMob Server

[Download the StackMob Web Server](https://s3.amazonaws.com/static.stackmob.com/resources/dev/stackmobserver-v0.1.0.zip)


### Choose a test suite

Go to one of the following:  
`htp://localhost:4567/test/spec-jquery.html`  
`htp://localhost:4567/test/spec-sencha.html`  
`htp://localhost:4567/test/spec-zepto.html`  


# Copyright

Copyright 2012 StackMob

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.