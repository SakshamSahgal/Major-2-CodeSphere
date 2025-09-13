#!/bin/bash
script_path="$1"
executable_path="$2"
output_file_path="$3"
time_limit="$4"      # Time limit in seconds
max_file_size="$5"   # Max file size limit in bytes
input_value="$6"     # Input value to be passed to stdin

# Compile the code
g++ -o "${executable_path}" "$script_path"
if [ $? -ne 0 ]; then
    echo "Error: Compilation failed"
    exit 3
fi

# Run program with time limit + input redirection
# Use "timeout" if available, else fall back to running directly
if command -v timeout >/dev/null 2>&1; then
    timeout "${time_limit}s" bash -c "echo '$input_value' | \"$executable_path\" | head -c $max_file_size > \"$output_file_path\""
    exit_status=$?
else
    # Fallback: no timeout command (on Windows Git Bash)
    echo "$input_value" | "$executable_path" | head -c "$max_file_size" > "$output_file_path"
    exit_status=$?
fi

# Handle exit codes
if [ $exit_status -eq 124 ]; then
    echo "tle"
    rm -f "$output_file_path"
    exit 1
elif [ $exit_status -ne 0 ]; then
    echo "Error: Execution failed with exit status $exit_status"
    rm -f "$output_file_path"
    exit 4
else
    # File size check (portable across Linux + Git Bash)
    if [ -f "$output_file_path" ]; then
        file_size=$(wc -c <"$output_file_path")
        if [ "$file_size" -ge "$max_file_size" ]; then
            echo "mle"
            rm -f "$output_file_path"
            exit 2
        fi
    fi
    echo "Execution completed successfully"
    exit 0
fi
