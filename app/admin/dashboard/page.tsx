'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FolderOpen, MessageSquare, Bell, Plus, Inbox,
  ArrowRight, User, Mail, Calendar,
} from 'lucide-react';
import { listProjects } from '@/services/projects.service';
import { listMessages, countMessages } from '@/services/messages.service';
import type { Message } from '@/types/message';

interface Stats {
  totalProjects: number;
  totalMessages: number;
  unreadMessages: number;
}

export default function DashboardPage() {
  const [stats, setStats]   = useState<Stats>({ totalProjects: 0, totalMessages: 0, unreadMessages: 0 });
  const [recent, setRecent] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projects, totalMessages, unreadMessages, recentMessages] = await Promise.all([
          listProjects(),
          countMessages(),
          countMessages(true),
          listMessages({ limit: 5 }),
        ]);
        setStats({
          totalProjects:  projects.length,
          totalMessages,
          unreadMessages,
        });
        setRecent(recentMessages);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Projects',  value: stats.totalProjects,  Icon: FolderOpen,     color: '#2563eb', href: '/admin/projects' },
    { label: 'Total Messages',  value: stats.totalMessages,  Icon: MessageSquare,  color: '#7c3aed', href: '/admin/messages' },
    { label: 'Unread Messages', value: stats.unreadMessages, Icon: Bell,           color: '#d97706', href: '/admin/messages' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', fontWeight: 800, color: 'var(--foreground)', margin: '0 0 0.35rem' }}>Dashboard</h1>
        <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.9rem' }}>Welcome back! Here&apos;s your portfolio at a glance.</p>
      </div>

      {/* Stat Cards */}
      <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map(({ label, value, Icon, color, href }) => (
          <Link key={label} href={href} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={color} />
                </div>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
              </div>
              {loading ? (
                <div style={{ width: '3rem', height: '2rem', background: 'var(--border)', borderRadius: '0.4rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
              ) : (
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
              )}
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.4rem' }}>{label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="admin-quick-actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/projects/new" style={{ textDecoration: 'none' }}>
          <div style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(37,99,235,0.03))',
            border: '1.5px dashed rgba(37,99,235,0.35)',
            borderRadius: '1.25rem',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '1rem',
            transition: 'all 0.2s',
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Plus size={20} color="#2563eb" />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.2rem' }}>Add New Project</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Publish a new portfolio item</div>
            </div>
          </div>
        </Link>
        <Link href="/admin/messages" style={{ textDecoration: 'none' }}>
          <div style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(124,58,237,0.03))',
            border: '1.5px dashed rgba(124,58,237,0.35)',
            borderRadius: '1.25rem',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '1rem',
            transition: 'all 0.2s',
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Inbox size={20} color="#7c3aed" />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.2rem' }}>View Messages</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                {loading ? '…' : `${stats.unreadMessages} unread message${stats.unreadMessages !== 1 ? 's' : ''}`}
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Messages */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Recent Messages</h2>
          <Link href="/admin/messages" style={{ fontSize: '0.85rem', color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            View all <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ height: '60px', background: 'var(--surface-2)', borderRadius: '0.65rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
            <Inbox size={32} style={{ margin: '0 auto 0.75rem', display: 'block', opacity: 0.4 }} />
            <p style={{ margin: 0, fontSize: '0.9rem' }}>No messages yet. Share your contact page!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recent.map(msg => (
              <Link key={msg.id} href="/admin/messages" style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  background: msg.read ? 'transparent' : 'rgba(37,99,235,0.06)',
                  border: `1px solid ${msg.read ? 'var(--border)' : 'rgba(37,99,235,0.2)'}`,
                  borderRadius: '0.65rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                    {/* Avatar */}
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <User size={14} color="#fff" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {!msg.read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, display: 'inline-block' }} />}
                        <span style={{ fontWeight: 700, color: 'var(--foreground)', fontSize: '0.9rem' }}>{msg.name}</span>
                        <span style={{ color: 'var(--muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Mail size={11} /> {msg.email}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {msg.subject || 'No subject'} · {msg.message?.slice(0, 60)}…
                      </div>
                    </div>
                  </div>
                  {msg.createdAt && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', marginLeft: '1rem', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={11} />
                      {new Date(msg.createdAt.seconds * 1000).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}
