#!/bin/bash

# Function to execute the executable_path and stream its stdout into a file
execute_and_stream_stdout_with_timeout() {
    local executable_path="$1"
    local output_file_path="$2"
    local time_limit="$3"  # Time limit in seconds
    local max_file_size="$4"  # Max file size limit in bytes

    # Execute the command with a time limit and stream its stdout into the output file
    timeout "$time_limit"s sh -c "$executable_path | head -c $max_file_size > $output_file_path"
    
    # Check the exit status of the timeout command
    local exit_status=$?
    
    if [ $exit_status -eq 124 ]; then
        # Timeout occurred
        echo "Error: Execution timed out after $time_limit seconds"
        rm -f "$output_file_path"  # Remove the output file
        exit 2  # Exit code for timeout
    elif [ $exit_status -ne 0 ]; then
        # Other errors occurred
        echo "Error: Execution failed with exit status $exit_status"
        rm -f "$output_file_path"  # Remove the output file
        exit 1  # Exit code for other errors
    else
        echo "Execution completed successfully"
        exit 0  # Exit code for successful execution
    fi
}
# <executable_path> <output_file_path> <time_limit>
execute_and_stream_stdout_with_timeout "./normal" "output.txt" 5 31457280   # Timeout after 5 seconds # 30MB