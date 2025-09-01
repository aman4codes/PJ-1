
import { Search, User, Mail, Hash } from 'lucide-react';
import { Student } from '../types';
import { useState } from 'react';

interface StudentListProps {
  students: Student[];
}


export function StudentList({ students }: StudentListProps) 
{
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
      <div className="flex items-center gap-3 mb-6">
        <User className="text-blue-600 dark:text-blue-400" size={24} />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Registered Students</h2>
        <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-sm font-medium">
          {students.length} total
        </span>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students by name, roll number, or email..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md dark:hover:shadow-gray-900/20 transition-all bg-white dark:bg-gray-700"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full">
              <User className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 dark:text-white">{student.name}</h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <Hash size={14} />
                  <span>{student.rollNumber}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail size={14} />
                  <span>{student.email}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="bg-gray-100 dark:bg-gray-600 px-3 py-1 rounded-md">
                <span className="text-xs font-mono text-gray-700 dark:text-gray-300">{student.qrCode}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <Search className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
          <p className="text-gray-500 dark:text-gray-400">No students found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}