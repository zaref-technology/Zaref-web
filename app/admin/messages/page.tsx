'use client';

import { useEffect, useState } from 'react';
import {
  collection, getDocs, orderBy, query, updateDoc, deleteDoc, doc, Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Inbox, User, Mail, Calendar, Trash2, Reply, ChevronDown, Loader2,
} from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Timestamp | null;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter]     = useState<'all' | 'unread' | 'read'>('all');

  const fetchMessages = async () => {
    try {
      const snap = await getDocs(query(collection(db, 'messages'), orderBy('createdAt', 'desc')));
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as Message)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleExpand = async (msg: Message) => {
    setExpanded(prev => prev === msg.id ? null : msg.id);
    if (!msg.read) {
      try {
        await updateDoc(doc(db, 'messages', msg.id), { read: true });
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await deleteDoc(doc(db, 'messages', id));
      setMessages(prev => prev.filter(m => m.id !== id));
      if (expanded === id) setExpanded(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = messages.filter(m => {
    if (filter === 'unread') return !m.read;
    if (filter === 'read')   return m.read;
    return true;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', fontWeight: 800, color: 'var(--foreground)', margin: '0 0 0.35rem' }}>Messages</h1>
        <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.9rem' }}>
          {messages.length} message{messages.length !== 1 ? 's' : ''}{unreadCount > 0 ? ` · ${unreadCount} unread` : ''}
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['all', 'unread', 'read'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '999px',
              border: '1.5px solid',
              borderColor: filter === tab ? 'var(--primary)' : 'var(--border)',
              background: filter === tab ? 'var(--primary)' : 'transparent',
              color: filter === tab ? '#fff' : 'var(--muted)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
          >
            {tab}{tab === 'unread' && unreadCount > 0 ? ` (${unreadCount})` : ''}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ height: '80px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.75rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Inbox size={48} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.3, color: 'var(--muted)' }} />
          <h2 style={{ fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.5rem' }}>
            {filter === 'all' ? 'No messages yet' : `No ${filter} messages`}
          </h2>
          <p style={{ color: 'var(--muted)' }}>
            {filter === 'all' ? 'Messages from your contact form will appear here.' : `All messages are ${filter === 'read' ? 'unread' : 'read'}.`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(msg => (
            <div
              key={msg.id}
              style={{
                background: 'var(--surface)',
                border: `1px solid ${!msg.read ? 'rgba(37,99,235,0.3)' : 'var(--border)'}`,
                borderRadius: '0.85rem',
                overflow: 'hidden',
                transition: 'all 0.2s',
                boxShadow: !msg.read ? '0 0 0 1px rgba(37,99,235,0.08)' : 'none',
              }}
            >
              {/* Message Header */}
              <div
                onClick={() => handleExpand(msg)}
                style={{
                  display: 'flex', alignItems: 'center',
                  padding: '1rem 1.25rem',
                  cursor: 'pointer',
                  gap: '1rem',
                  background: expanded === msg.id ? 'var(--surface-2)' : 'transparent',
                  transition: 'background 0.2s',
                }}
              >
                {/* Unread dot */}
                <div style={{
                  width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0,
                  background: msg.read ? 'transparent' : 'var(--primary)',
                  boxShadow: msg.read ? 'none' : '0 0 6px var(--primary)',
                }} />

                {/* Avatar */}
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <User size={16} color="#fff" />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: msg.read ? 600 : 800, color: 'var(--foreground)', fontSize: '0.95rem' }}>{msg.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Mail size={11} /> {msg.email}
                    </span>
                    {!msg.read && (
                      <span style={{ padding: '0.1rem 0.5rem', background: 'rgba(37,99,235,0.12)', color: 'var(--primary-light)', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 700 }}>
                        NEW
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <strong style={{ color: 'var(--foreground)' }}>{msg.subject || 'No subject'}</strong>
                    {msg.message && ` — ${msg.message.slice(0, 60)}${msg.message.length > 60 ? '…' : ''}`}
                  </div>
                </div>

                {/* Date + expand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                  {msg.createdAt && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={11} />
                      {new Date(msg.createdAt.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                  <ChevronDown
                    size={15}
                    color="var(--muted)"
                    style={{ transform: expanded === msg.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                  />
                </div>
              </div>

              {/* Expanded Content */}
              {expanded === msg.id && (
                <div style={{ padding: '0 1rem 1rem 1rem', borderTop: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                  <div style={{ paddingTop: '1rem' }}>
                    {/* Full message */}
                    <div style={{
                      padding: '1rem',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '0.65rem',
                      fontSize: '0.925rem',
                      color: 'var(--foreground)',
                      lineHeight: 1.8,
                      whiteSpace: 'pre-wrap',
                      marginBottom: '1rem',
                    }}>
                      {msg.message || '(No message body)'}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || '')}`}
                        className="btn-primary"
                        style={{ textDecoration: 'none', padding: '0.55rem 1.25rem', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <Reply size={14} /> Reply
                      </a>
                      <button
                        onClick={() => handleDelete(msg.id)}
                        disabled={deleting === msg.id}
                        style={{
                          padding: '0.55rem 1.25rem',
                          background: 'rgba(220,38,38,0.08)',
                          border: '1px solid rgba(220,38,38,0.25)',
                          borderRadius: '0.65rem',
                          color: '#ef4444',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          cursor: deleting === msg.id ? 'not-allowed' : 'pointer',
                          opacity: deleting === msg.id ? 0.6 : 1,
                          transition: 'all 0.2s',
                          display: 'flex', alignItems: 'center', gap: '0.4rem',
                          fontFamily: 'inherit',
                        }}
                      >
                        {deleting === msg.id
                          ? <><Loader2 size={13} style={{ animation: 'spin 0.7s linear infinite' }} /> Deleting…</>
                          : <><Trash2 size={13} /> Delete</>
                        }
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
