import React from 'react';
import { groupedPeriods } from '@site/src/data/council-periods.js';
import SenfiAccordion from './SenfiAccordion';
import { useColorMode } from '@docusaurus/theme-common';
import StatsPanel from './StatsPanel';
import { container as sharedContainer } from '../theme/sharedStyles';

const FamilyTree = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  // محاسبه تعداد کل اعضا
  const totalMembers = groupedPeriods.reduce((acc, group) => 
    acc + group.periods.reduce((sum, period) => {
      const committeeMembers = (period.committees || []).reduce((s, committee) => 
        s + (committee.members || []).length, 0);
      const unitMembers = (period.units || []).reduce((s, unit) => 
        s + (unit.members || []).length, 0);
      return sum + committeeMembers + unitMembers;
    }, 0), 0);

  // تبدیل به عدد حدودی - گرد کردن به نزدیک‌ترین ۱۰۰
  const approximateMembers = Math.round(totalMembers / 100) * 100;
  const displayNumber = `+${approximateMembers}`;

  return (
    <div style={sharedContainer}>
      <StatsPanel
        stats={[
          { icon: '👥', label: 'تعداد کل اعضا', value: displayNumber },
        ]}
        // حذف background/border سفارشی، فقط sharedStyles
      />
      
      {groupedPeriods.map((group, groupIndex) => (
        <SenfiAccordion
          key={group.groupTitle}
          title={group.groupTitle}
          defaultOpen={false}
          icon="📅"
        >
          {group.periods.map((council, periodIndex) => (
            <SenfiAccordion
              key={council.meta.period}
              title={council.meta.faTitle}
              defaultOpen={false}
              icon="👥"
            >
              {council.meta.description && (
                <div
                  style={{ 
                    color: isDark ? 'var(--ifm-color-primary-lightest)' : 'var(--ifm-color-primary-dark)',
                    fontSize: '0.95rem', 
                    marginBottom: '1rem',
                    padding: '1rem',
                    background: isDark ? 'rgba(30,34,54,0.95)' : 'rgba(255,255,255,0.5)',
                    borderRadius: '0.5rem',
                    border: isDark ? '1px solid #637eda' : '1px solid var(--ifm-color-primary-lightest)',
                    lineHeight: '1.6'
                  }}
                  dangerouslySetInnerHTML={{ __html: council.meta.description }}
                />
              )}
              {/* Committees List */}
              {council.committees && council.committees.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>کارگروه‌ها:</div>
                  <ul style={{ paddingRight: 18, margin: 0 }}>
                    {council.committees.map((committee, idx) => (
                      <li key={idx} style={{ marginBottom: 2 }}>
                        <span style={{ fontWeight: 500 }}>{committee.title}</span>
                        {committee.members && committee.members.length > 0 && (
                          <span style={{ color: '#888', fontSize: '0.95em', marginRight: 8 }}>
                            {' '}({committee.members.length} عضو)
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Units List */}
              {council.units && council.units.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>واحدها:</div>
                  <ul style={{ paddingRight: 18, margin: 0 }}>
                    {council.units.map((unit, idx) => (
                      <li key={idx} style={{ marginBottom: 2 }}>
                        <span style={{ fontWeight: 500 }}>{unit.title}</span>
                        {unit.members && unit.members.length > 0 && (
                          <span style={{ color: '#888', fontSize: '0.95em', marginRight: 8 }}>
                            {' '}({unit.members.length} عضو)
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </SenfiAccordion>
          ))}
        </SenfiAccordion>
      ))}
    </div>
  );
};

export default FamilyTree;
