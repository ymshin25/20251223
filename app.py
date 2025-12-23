import streamlit as st
from streamlit_code_editor import code_editor
from py_mini_racer import MiniRacer

# Set page configuration for a wider layout
st.set_page_config(layout="wide")

st.title("Interactive JavaScript Coding Tutorial")
st.markdown("Enter your JavaScript code below and click 'Run' to see the output in the console.")

# Default JavaScript code to display in the editor
initial_code = """
# Welcome to your interactive JavaScript tutorial!
# You can write and run your code here.

function greet(name) {
    return "Hello, " + name + "!";
}

let user = "Developer";
let message = greet(user);

# Use console.log() to print output to the console below
console.log(message);
console.log("Try changing the 'user' variable and run again!");
console.log("2 + 2 =", 2 + 2);

"""

# Display the CodeMirror editor
# The `key` parameter is important to maintain state between reruns
code = code_editor(initial_code, lang="javascript", height="25em", key="code_editor")


# Create the 'Run' button
if st.button("Run", type="primary"):
    st.subheader("Console Output")
    
    # Create a JS context using py_mini_racer
    ctx = MiniRacer()
    
    # A JavaScript wrapper to capture console.log outputs
    js_wrapper = f"""
    let output = [];
    const console = {
        log: function(...args) {
            output.push(args.map(arg => JSON.stringify(arg)).join(' '));
        }
    };
    
    try {
        eval(`{code['text']}`);
        // Return the captured output as a single string, with each log on a new line
        JSON.stringify(output);
    }} catch (e) {
        // Return error message if execution fails
        JSON.stringify([e.toString()]);
    }}    
    """
    
    try:
        # Execute the wrapped JS code
        result = ctx.eval(js_wrapper)
        
        # The result is a JSON string of an array, so we parse it
        import json
        output_lines = json.loads(result)
        
        # Display the captured console output
        if output_lines:
            # Join lines and remove quotes from stringified output for cleaner look
            cleaned_output = "\n".join(line.strip('"') for line in output_lines)
            st.code(cleaned_output, language="")
        else:
            st.info("Code executed, but there was no output in the console.")

    except Exception as e:
        # Display any Python-level errors
        st.error(f"An error occurred: {e}")

st.info(
    """
    **How to use this platform:**
    1.  **Write Code:** Type your JavaScript code in the editor above.
    2.  **Execute:** Click the "Run" button.
    3.  **View Output:** See the results from `console.log()` in the "Console Output" area.
    """
)

st.warning(
    """
    **Note:** This is a sandboxed environment. Advanced browser/Node.js APIs 
    (like `fetch`, `document`, `require`) are not available.
    """
)
