import React from 'react';
import styles from './textarea.module.css';

interface TextAreaProps
extends React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> {}

const TextArea = React.forwardRef(function Textarea(
  {value, placeholder, className, ...props}: TextAreaProps,
  ref
) {
  return (
    <>
      <div className={`${styles.div}`}>
        <textarea
          placeholder={placeholder}
          ref={ref as React.LegacyRef<HTMLTextAreaElement>}
          {...props}
          className={styles.textarea}
        >
          {value}
        </textarea>
      </div>
    </>
  );
});

export default React.memo(TextArea);
