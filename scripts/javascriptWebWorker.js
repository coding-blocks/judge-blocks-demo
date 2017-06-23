/**
 * Created by abhishek on 07/05/17.
 */
'use strict';

onmessage = function (e) {
    var output = [];
    var INPUT = JSON.parse(e.data.input);
    try {
        eval(`
            console.log = function(str){
                output.push(str);
            }
            
            ${e.data.source}
        `);
    } catch (e) {
        output = [`Error : ${e}`] ;
    } finally {
        postMessage({output});
    }
    
};