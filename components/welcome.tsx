// app/components/Welcome.tsx
import { useState, FormEvent } from 'react';

const Welcome: React.FC<{ onNameSubmit: (name: string) => void }> = ({ onNameSubmit }) => {
  const [name, setName] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    onNameSubmit(name);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      {!isSubmitted ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">What is your name?</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
      ) : (
        <h1>Hey {name}, what can I do for you?</h1>
      )}
    </div>
  );
};

export default Welcome;
