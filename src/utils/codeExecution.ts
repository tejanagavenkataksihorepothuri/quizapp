export async function executeCode(code: string, testCase: { input: string; expectedOutput: string }) {
  try {
    // Create a safe evaluation context
    const fn = new Function('input', code);
    const result = fn(testCase.input);
    
    // Convert result to string for comparison
    const resultStr = String(result).trim();
    const expectedStr = String(testCase.expectedOutput).trim();
    
    return {
      success: resultStr === expectedStr,
      output: resultStr,
      expected: expectedStr,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      output: null,
      expected: testCase.expectedOutput,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}