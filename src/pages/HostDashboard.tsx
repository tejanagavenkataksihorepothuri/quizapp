import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { Play, Users, Clock } from 'lucide-react';

export function HostDashboard() {
  const { joinCode } = useParams<{ joinCode: string }>();
  const { getQuizSession, getParticipantsByQuiz, startQuizSession } = useQuizStore();
  const [session, setSession] = useState(useQuizStore.getState().getQuizSession(joinCode || ''));
  const [participants, setParticipants] = useState<any[]>([]);

  useEffect(() => {
    if (!session) return;

    const updateParticipants = () => {
      setParticipants(getParticipantsByQuiz(session.id));
    };

    // Update initially and set up interval for real-time updates
    updateParticipants();
    const interval = setInterval(updateParticipants, 2000);

    return () => clearInterval(interval);
  }, [session, getParticipantsByQuiz]);

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-red-600">Quiz session not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{session.name}</h2>
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-md font-mono">
              Join Code: {session.joinCode}
            </div>
            {session.status === 'waiting' && (
              <button
                onClick={() => startQuizSession(session.id)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Quiz
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <Users className="h-5 w-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-medium">Participants ({participants.length})</h3>
            </div>
            <div className="space-y-2">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm"
                >
                  <span>{participant.name}</span>
                  <span className="text-sm text-gray-500">ID: {participant.id}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-medium">Quiz Status</h3>
            </div>
            <div className="space-y-2">
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="font-medium">Status: {session.status}</p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(session.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="font-medium">Questions: {session.questions.length}</p>
                <p className="text-sm text-gray-500">
                  Total Points: {session.questions.reduce((sum, q) => sum + q.points, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {session.status === 'active' && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Live Results</h3>
            <div className="space-y-4">
              {participants.map((participant) => (
                <div key={participant.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{participant.name}</span>
                    <span className="text-indigo-600 font-medium">
                      Score: {participant.score}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-indigo-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${(Object.keys(participant.answers).length / session.questions.length) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}