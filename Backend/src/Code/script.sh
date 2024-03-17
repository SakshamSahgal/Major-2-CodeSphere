execute_and_pipe_stdout() {
    local executable_path="$1"
    local output_file_path="$2"
    local time_limit="$3"  # Time limit in seconds
    
    # Execute the command with a time limit and redirect stdout to the output file
    timeout "$time_limit"s "$executable_path" > "$output_file_path"
    
    # Check the exit status of the command
    local exit_status=$?
    
    if [ $exit_status -eq 0 ]; then
        # Success
        echo "Execution successful"
        exit 0
    elif [ $exit_status -eq 124 ]; then
        # Timeout
        echo "Error: Execution timed out after $time_limit seconds"
        exit 2
    else
        # Error
        echo "Error: Failed to execute $executable_path"
        exit 1
    fi
}

# Usage example
execute_and_pipe_stdout "./normal" "./output.txt" "5"