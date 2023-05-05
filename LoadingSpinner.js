import { Spinner } from '@geist-ui/react';

export default function LoadingSpinner({ text }) {
  return (
    <div className="loading-spinner">
      <Spinner />
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
}
