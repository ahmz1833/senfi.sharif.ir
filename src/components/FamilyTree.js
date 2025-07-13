import React from 'react';
import SharifCouncilDropDown from '@site/src/components/SharifCouncilDropDown';
import { groupedPeriods } from '@site/src/data/council-periods.js';
import { PeriodAccordion } from './PeriodAccordion';



const FamilyTree = () => (
  <div style={{ direction: 'rtl', textAlign: 'right', fontFamily: "inherit"}}>
    {groupedPeriods.map(group => (
      <PeriodAccordion key={group.groupTitle} title={group.groupTitle} defaultOpen={false}>
        {/* هر کدوم از دوره‌ها (periods) رو زیر همین آکاردئون بیار */}
        {group.periods.map(council => (
          <PeriodAccordion
            key={council.meta.period}
            title={council.meta.faTitle}
            defaultOpen={false}
          >
            {council.meta.description && (
              <div
                style={{ color: '#666', fontSize: 15, marginBottom: 14 }}
                dangerouslySetInnerHTML={{ __html: council.meta.description }}
              />
            )}
            <SharifCouncilDropDown title="کارگروه‌ها" items={council.committees} />
            <SharifCouncilDropDown title="واحدها" items={council.units} />
          </PeriodAccordion>
        ))}
      </PeriodAccordion>
    ))}
  </div>
);

export default FamilyTree;
