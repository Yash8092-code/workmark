import React from 'react';
import { Badge } from '../ui/Badge';

interface SkillTagsProps {
  skills: string[];
  max?: number;
}

export const SkillTags: React.FC<SkillTagsProps> = ({ skills, max }) => {
  const displaySkills = max ? skills.slice(0, max) : skills;
  const remaining = max && skills.length > max ? skills.length - max : 0;

  return (
    <div className="flex flex-wrap gap-2">
      {displaySkills.map((skill, index) => (
        <Badge key={index} variant="default">
          {skill}
        </Badge>
      ))}
      {remaining > 0 && (
        <Badge variant="default">+{remaining} more</Badge>
      )}
    </div>
  );
};
