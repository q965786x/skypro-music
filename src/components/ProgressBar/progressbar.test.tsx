import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ProgressBar from './ProgressBar';

describe('ProgressBar Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('отображается с правильными атрибутами', () => {
    render(
      <ProgressBar
        max={100}
        value={50}
        step={1}
        onChange={mockOnChange}
        readOnly={false}
      />,
    );

    const input = screen.getByRole('slider');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'range');
    expect(input).toHaveAttribute('max', '100');
    expect(input).toHaveAttribute('value', '50');
    expect(input).toHaveAttribute('step', '1');
  });

  test('вызывает onChange при изменении значения', () => {
    render(
      <ProgressBar
        max={100}
        value={50}
        step={1}
        onChange={mockOnChange}
        readOnly={false}
      />,
    );

    const input = screen.getByRole('slider');
    fireEvent.change(input, { target: { value: '75' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  test('имеет класс styledProgressInput', () => {
    render(
      <ProgressBar
        max={100}
        value={50}
        step={1}
        onChange={mockOnChange}
        readOnly={false}
      />,
    );

    const input = screen.getByRole('slider');
    expect(input).toHaveClass('styledProgressInput');
  });

  test('обрабатывает readOnly состояние', () => {
    render(
      <ProgressBar
        max={100}
        value={50}
        step={1}
        onChange={mockOnChange}
        readOnly={true}
      />,
    );

    const input = screen.getByRole('slider');
    expect(input).toHaveAttribute('readonly');
  });

  test('обрабатывает max = 0', () => {
    render(
      <ProgressBar
        max={0}
        value={0}
        step={1}
        onChange={mockOnChange}
        readOnly={false}
      />,
    );

    const input = screen.getByRole('slider');
    expect(input).toHaveAttribute('max', '0');
  });
});
