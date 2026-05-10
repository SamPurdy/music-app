// pwsh_shim.go — Wraps Git Bash so the Copilot CLI can run shell commands.
// Build once, install to PATH. See build-pwsh.bat for automated install.
//
// Build manually:
//   go build -o C:\path\in\PATH\pwsh.exe pwsh_shim.go

package main

import (
	"fmt"
	"os"
	"os/exec"
	"strings"
)

var bashCandidates = []string{
	`C:\Program Files\Git\bin\bash.exe`,
	`C:\Program Files (x86)\Git\bin\bash.exe`,
	`C:\Git\bin\bash.exe`,
}

func findBash() string {
	// 1. Check common install paths
	for _, p := range bashCandidates {
		if _, err := os.Stat(p); err == nil {
			return p
		}
	}
	// 2. Fall back to whatever is on PATH
	if p, err := exec.LookPath("bash"); err == nil {
		return p
	}
	return ""
}

func main() {
	args := os.Args[1:]

	// ── Version check (required by Copilot CLI before creating a session) ──
	if len(args) == 1 && args[0] == "--version" {
		fmt.Println("PowerShell 7.4.6")
		os.Exit(0)
	}

	bash := findBash()
	if bash == "" {
		fmt.Fprintln(os.Stderr, "pwsh-shim: Git Bash not found. Install Git for Windows from https://git-scm.com")
		os.Exit(1)
	}

	// ── Build bash args by translating common pwsh flags ───────────────────
	var bashArgs []string
	noRC := false
	i := 0
	for i < len(args) {
		switch args[i] {
		case "-NoProfile", "-NoLogo":
			noRC = true
			i++
		case "-NonInteractive":
			i++
		case "-ExecutionPolicy":
			i += 2 // skip the policy value
		case "-Command", "-c":
			i++
			// Collect everything remaining as a single bash -c command
			if i < len(args) {
				cmd := strings.Join(args[i:], " ")
				bashArgs = append(bashArgs, "-c", cmd)
				i = len(args)
			}
		case "-File":
			i++
			if i < len(args) {
				bashArgs = append(bashArgs, args[i:]...)
				i = len(args)
			}
		default:
			bashArgs = append(bashArgs, args[i])
			i++
		}
	}

	// If no sub-command, run interactively
	if len(bashArgs) == 0 {
		if noRC {
			bashArgs = []string{"--norc", "-i"}
		} else {
			bashArgs = []string{"--login", "-i"}
		}
	}

	cmd := exec.Command(bash, bashArgs...)
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Env = os.Environ()

	if err := cmd.Run(); err != nil {
		if exitErr, ok := err.(*exec.ExitError); ok {
			os.Exit(exitErr.ExitCode())
		}
		os.Exit(1)
	}
}
