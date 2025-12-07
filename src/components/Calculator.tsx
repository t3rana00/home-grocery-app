import { useState } from 'react';
import './Calculator.css';

interface CalculatorProps {
  onCalculate: (result: number) => void;
  onClose: () => void;
}

export function Calculator({ onCalculate, onClose }: CalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let newValue = currentValue;

      switch (operation) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '*':
          newValue = currentValue * inputValue;
          break;
        case '/':
          newValue = currentValue / inputValue;
          break;
        default:
          break;
      }

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      let result = previousValue;

      switch (operation) {
        case '+':
          result = previousValue + inputValue;
          break;
        case '-':
          result = previousValue - inputValue;
          break;
        case '*':
          result = previousValue * inputValue;
          break;
        case '/':
          result = previousValue / inputValue;
          break;
        default:
          break;
      }

      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const handleUseResult = () => {
    const result = parseFloat(display);
    if (!isNaN(result) && result > 0) {
      onCalculate(result);
      onClose();
    }
  };

  return (
    <div className="calculator-overlay" onClick={onClose}>
      <div className="calculator" onClick={(e) => e.stopPropagation()}>
        <div className="calculator-header">
          <h3>Calculator</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="calculator-display">{display}</div>
        <div className="calculator-buttons">
          <button className="calc-btn" onClick={clear}>
            C
          </button>
          <button className="calc-btn" onClick={() => performOperation('/')}>
            ÷
          </button>
          <button className="calc-btn" onClick={() => performOperation('*')}>
            ×
          </button>
          <button className="calc-btn" onClick={() => performOperation('-')}>
            −
          </button>

          <button className="calc-btn" onClick={() => inputDigit('7')}>
            7
          </button>
          <button className="calc-btn" onClick={() => inputDigit('8')}>
            8
          </button>
          <button className="calc-btn" onClick={() => inputDigit('9')}>
            9
          </button>
          <button className="calc-btn operation" onClick={() => performOperation('+')}>
            +
          </button>

          <button className="calc-btn" onClick={() => inputDigit('4')}>
            4
          </button>
          <button className="calc-btn" onClick={() => inputDigit('5')}>
            5
          </button>
          <button className="calc-btn" onClick={() => inputDigit('6')}>
            6
          </button>
          <button className="calc-btn span-row" onClick={handleEquals}>
            =
          </button>

          <button className="calc-btn" onClick={() => inputDigit('1')}>
            1
          </button>
          <button className="calc-btn" onClick={() => inputDigit('2')}>
            2
          </button>
          <button className="calc-btn" onClick={() => inputDigit('3')}>
            3
          </button>

          <button className="calc-btn span-col" onClick={() => inputDigit('0')}>
            0
          </button>
          <button className="calc-btn" onClick={inputDecimal}>
            .
          </button>
        </div>
        <button className="use-result-btn" onClick={handleUseResult}>
          Use Result
        </button>
      </div>
    </div>
  );
}
