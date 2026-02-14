import styles from './progressbar.module.css';
import { ChangeEvent } from 'react';

type progressBarProp = {
  max: number;
  value: number;
  step: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  readOnly: boolean;
};

export default function ProgressBar({
  max,
  value,
  step,
  onChange,
  readOnly,
}: progressBarProp) {
  return (
    <input
      className={styles.styledProgressInput}
      type="range"
      min={0}
      max={max || 0}
      value={value}
      step={step}
      onChange={onChange}
      readOnly={readOnly}
    />
  );
}
