'use client';

import { useState, useEffect } from 'react';

type Question = {
  left: number;
  right: number;
  answer: number;
  mnemonic?: string;
};

export default function Home() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  const fetchQuestion = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/multiplication`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data: Question = await res.json();
      setQuestion(data);
      setInput('');
      setResult(null);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;

    if (parseInt(input) === question.answer) {
      setResult('correct');
      setTimeout(() => fetchQuestion(), 1000);
    } else {
      setResult('wrong');
    }
  };

  const onNumberClick = (num: number) => {
    if (result === 'correct') return;
    setInput((prev) => prev + num.toString());
  };

  const onClear = () => {
    if (result === 'correct') return;
    setInput('');
  };

  return (
    <main
      style={{
        maxWidth: '90%',
        margin: '40px auto',
        padding: 24,
        borderRadius: 12,
        boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
        backgroundColor: '#f9fafb',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        textAlign: 'center',
        userSelect: 'none',
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 20, color: '#2c3e50' }}>九九の練習</h1>

      {question ? (
        <>
          <div
            style={{
              fontSize: 44,
              fontWeight: 'bold',
              color: '#34495e',
              marginBottom: 24,
              userSelect: 'text',
            }}
          >
            {question.left} × {question.right} = ?
          </div>

          <form onSubmit={onSubmit} style={{ marginBottom: 20 }}>
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              style={{
                fontSize: 28,
                width: 140,
                padding: '8px 12px',
                borderRadius: 8,
                border: '2px solid #2980b9',
                outline: 'none',
                textAlign: 'center',
                transition: 'border-color 0.3s',
              }}
              disabled={result === 'correct'}
              min={0}
            />
            <button
              type="submit"
              disabled={result === 'correct'}
              style={{
                fontSize: 24,
                marginLeft: 16,
                padding: '10px 24px',
                backgroundColor: result === 'correct' ? '#95a5a6' : '#2980b9',
                border: 'none',
                borderRadius: 8,
                color: 'white',
                cursor: result === 'correct' ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s',
              }}
            >
              回答
            </button>
          </form>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 10,
              marginBottom: 20,
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onNumberClick(num)}
                disabled={result === 'correct'}
                style={{
                  width: 54,
                  height: 54,
                  fontSize: 26,
                  borderRadius: '50%',
                  border: '2px solid #2980b9',
                  backgroundColor: '#ecf0f1',
                  color: '#34495e',
                  cursor: result === 'correct' ? 'not-allowed' : 'pointer',
                  userSelect: 'none',
                  transition: 'background-color 0.2s, color 0.2s',
                }}
                onMouseOver={(e) => {
                  if (result !== 'correct') {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3498db';
                    (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                  }
                }}
                onMouseOut={(e) => {
                  if (result !== 'correct') {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#ecf0f1';
                    (e.currentTarget as HTMLButtonElement).style.color = '#34495e';
                  }
                }}
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={onClear}
              disabled={result === 'correct'}
              style={{
                width: 100,
                height: 54,
                fontSize: 20,
                borderRadius: 8,
                border: '2px solid #e74c3c',
                backgroundColor: '#fceae9',
                color: '#c0392b',
                cursor: result === 'correct' ? 'not-allowed' : 'pointer',
                userSelect: 'none',
                transition: 'background-color 0.2s, color 0.2s',
              }}
              onMouseOver={(e) => {
                if (result !== 'correct') {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#e74c3c';
                  (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                }
              }}
              onMouseOut={(e) => {
                if (result !== 'correct') {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#fceae9';
                  (e.currentTarget as HTMLButtonElement).style.color = '#c0392b';
                }
              }}
            >
              クリア
            </button>
          </div>

          {result === 'correct' && (
            <p
              style={{
                color: '#27ae60',
                fontWeight: 'bold',
                fontSize: 24,
                userSelect: 'none',
              }}
            >
              正解！🎉
            </p>
          )}
        </>
      ) : (
        <p
          style={{
            fontSize: 18,
            color: '#7f8c8d',
            userSelect: 'none',
          }}
        >
          読み込み中...
        </p>
      )}
      <div>
          {result === 'wrong' && (
            <p
              style={{
                color: '#e74c3c',
                fontWeight: 'bold',
                fontSize: 20,
                userSelect: 'none',
                whiteSpace: 'pre-wrap',
              }}
            >
              不正解😢 答え: {question.answer}
              <br />
              覚え方: {question.mnemonic ?? '覚え方はありません'}
            </p>
          )}
      </div>
    </main>
  );
}
