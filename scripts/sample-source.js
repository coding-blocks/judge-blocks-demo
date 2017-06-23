/**
 * Created by umair on 27/12/16.
 */

var c_sample =
        '#include <stdio.h>\n' +
        'void main() {\n' +
        '    printf("Hello World!");\n' +
        '}\n';

var cpp_sample =
        '#include <iostream>\n' +
        'using namespace std;\n' +
        'int main() {\n' +
        '    cout<<"Hello World!";\n' +
        '}\n';

var java_sample =
        'public class Main {\n' +
        '    public static void main(String args[]) {\n' +
        '        System.out.println("Hello World!");\n' +
        '    }\n' +
        '}';

var py2_sample =
        'print("Hello World!")';

var js_sample =
`/* 
    Use INPUT variable to get stdin.
    Try console.log(INPUT);
*/
    console.log('Hello World');`;

var lang_samples = {
    c: c_sample,
    cpp: cpp_sample,
    java: java_sample,
    py2: py2_sample,
    js : js_sample
};
