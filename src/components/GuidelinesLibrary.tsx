import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Pill, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { CPG_REGIMENS, DRUG_INTERACTIONS, FIRST_LINE_DRUGS } from '../data/cpgData';

export const GuidelinesLibrary: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'regimens' | 'ddi' | 'drugs' | 'counseling'>('regimens');
  const [regimenSearch, setRegimenSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [ddiSearch, setDdiSearch] = useState('');

  const filteredRegimens = CPG_REGIMENS.filter(r => {
    const term = regimenSearch.toLowerCase();
    const matchTerm = r.name.toLowerCase().includes(term) || r.description.toLowerCase().includes(term) || r.type.toLowerCase().includes(term);
    const matchCat = selectedCategory === 'all' ? true : r.category === selectedCategory;
    return matchTerm && matchCat;
  });

  const filteredDdis = DRUG_INTERACTIONS.filter(d => {
    const term = ddiSearch.toLowerCase();
    return d.drug.toLowerCase().includes(term) || d.category.toLowerCase().includes(term) || d.clinicalImpact.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-700" />
              <span>คลังความรู้ & แนวทางการรักษาวัณโรคแห่งชาติ (Thailand CPG 2021)</span>
            </h2>
            <span className="bg-teal-100 text-teal-900 font-black text-[10px] px-2 py-0.5 rounded-full">
              กรมควบคุมโรค กระทรวงสาธารณสุข
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            รวบรวมสูตรยามาตรฐาน สูตรยาดื้อยา (Hr-TB/MDR-TB) ตารางอันตรกิริยาระหว่างยา และคู่มือการให้คำปรึกษา
          </p>
        </div>

        {/* Subtab Switcher */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('regimens')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'regimens' ? 'bg-white text-teal-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            สูตรยา CPG 2021
          </button>
          <button
            onClick={() => setActiveSubTab('ddi')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'ddi' ? 'bg-white text-teal-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            อันตรกิริยา (DDI Matrix)
          </button>
          <button
            onClick={() => setActiveSubTab('drugs')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'drugs' ? 'bg-white text-teal-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            เภสัชวิทยา First-Line
          </button>
          <button
            onClick={() => setActiveSubTab('counseling')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'counseling' ? 'bg-white text-teal-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            คู่มือบริบาลผู้ป่วย
          </button>
        </div>
      </div>

      {/* SUBTAB 1: REGIMENS LIST */}
      {activeSubTab === 'regimens' && (
        <div className="space-y-4">
          {/* Search & Category Filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-3 items-center justify-between text-xs">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาสูตรยา เช่น 2HRZE, 6RZEFQs, Bdq, Shorter..."
                value={regimenSearch}
                onChange={(e) => setRegimenSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="font-bold text-slate-500 whitespace-nowrap">หมวดหมู่สูตรยา:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none"
              >
                <option value="all">ทั้งหมด ({CPG_REGIMENS.length})</option>
                <option value="DS-TB">DS-TB (ไวต่อยา)</option>
                <option value="DR-TB (Mono/Poly)">DR-TB (ดื้อยาเดี่ยว/หลายตัว)</option>
                <option value="MDR/RR-TB">MDR/RR-TB (ดื้อ R/MDR)</option>
                <option value="Drug Reaction / Allergy">ตับอักเสบ / แพ้ยา (Hepatosafety)</option>
              </select>
            </div>
          </div>

          {/* Regimens Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRegimens.map((reg) => (
              <div
                key={reg.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-teal-400 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-black text-teal-900 bg-teal-100 px-2.5 py-0.5 rounded-lg">
                      {reg.category}
                    </span>
                    <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg font-mono">
                      {reg.durationMonths} เดือน
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900">{reg.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{reg.description}</p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-slate-800">
                      <span className="text-teal-800">สูตรการให้ยา:</span> {reg.dosingInfo}
                    </div>
                    <div className="text-slate-600 text-[11px] flex justify-between">
                      <span>Phase 1: {reg.phase1}</span>
                      <span>Phase 2: {reg.phase2}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
                  <span className="italic">{reg.referenceTable || 'CPG 2021'}</span>
                  <span className="text-teal-800 font-bold">{reg.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: DRUG INTERACTIONS MATRIX */}
      {activeSubTab === 'ddi' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between text-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหายาที่อาจมีอันตรกิริยา เช่น Dolutegravir, Warfarin, Statin..."
                value={ddiSearch}
                onChange={(e) => setDdiSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <span className="text-slate-500 font-medium">พบ {filteredDdis.length} รายการอันตรกิริยาสำคัญ</span>
          </div>

          <div className="space-y-3">
            {filteredDdis.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-900">{item.drug}</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
                      {item.category}
                    </span>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                    item.severity.includes('Major')
                      ? 'bg-rose-100 text-rose-900 border border-rose-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {item.severity}
                  </span>
                </div>

                <div className="text-xs text-slate-700 space-y-1">
                  <div>
                    <strong className="text-slate-900">กลไกอันตรกิริยา:</strong> {item.mechanism}
                  </div>
                  <div>
                    <strong className="text-rose-800">ผลกระทบทางคลินิก:</strong> {item.clinicalImpact}
                  </div>
                </div>

                <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-950 font-medium">
                  <strong className="text-teal-900 block font-bold mb-0.5">
                    คำแนะนำในการบริหารยาของเภสัชกร (Pharmacist Recommendation):
                  </strong>
                  {item.pharmacistRecommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: FIRST-LINE PHARMACOLOGY */}
      {activeSubTab === 'drugs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FIRST_LINE_DRUGS.map((drug) => (
            <div
              key={drug.code}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-teal-800 text-white font-black flex items-center justify-center text-sm shadow-xs">
                      {drug.code}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">{drug.genericName}</h3>
                      <span className="text-xs text-slate-500 font-medium">{drug.thaiName}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-teal-900 bg-teal-100 px-2 py-0.5 rounded">
                    Max: {drug.maxDoseMg} mg
                  </span>
                </div>

                <div className="text-xs space-y-2 pt-2 border-t border-slate-100">
                  <div>
                    <strong className="text-slate-900 block">ขนาดยามาตรฐาน:</strong>
                    <span className="text-slate-700">{drug.dailyDoseMgPerKg} ({drug.standardDoseMg})</span>
                  </div>

                  <div>
                    <strong className="text-slate-900 block">ช่วงเวลารับประทาน:</strong>
                    <span className="text-slate-700">{drug.takeTiming}</span>
                  </div>

                  <div>
                    <strong className="text-rose-800 block">อาการไม่พึงประสงค์สำคัญ (ADR):</strong>
                    <span className="text-slate-700">{drug.adverseEffects}</span>
                  </div>

                  <div>
                    <strong className="text-indigo-800 block">การปรับขนาดยาในผู้ป่วยไตวาย:</strong>
                    <span className="text-slate-700">{drug.renalAdjustment}</span>
                  </div>

                  <div>
                    <strong className="text-amber-800 block">ผลกระทบต่อตับ:</strong>
                    <span className="text-slate-700">{drug.hepaticNotes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 4: COUNSELING CHECKLIST */}
      {activeSubTab === 'counseling' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>คู่มือการให้คำปรึกษาและบริบาลเภสัชกรรมแก่ผู้ป่วยวัณโรค (Patient Counseling Pearls)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Checklist ที่เภสัชกรต้องสื่อสารกับผู้ป่วยและผู้ดูแลในทุกครั้งที่จ่ายยา
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
              <h4 className="font-black text-amber-950 text-sm flex items-center gap-1.5">
                <span>1. สารคัดหลั่งและปัสสาวะสีส้มแดง (Red-Orange Urine)</span>
              </h4>
              <p className="text-amber-900 leading-relaxed font-medium">
                เน้นย้ำให้ผู้ป่วยทราบว่า <strong>ยา Rifampicin จะทำให้ปัสสาวะ อุจจาระ น้ำลาย น้ำตา เหงื่อ เปลี่ยนเป็นสีส้มแดงหรือสีส้มเข้ม</strong> ซึ่งเป็นคุณสมบัติปกติของตัวยา ไม่ใช่เลือดออกในทางเดินปัสสาวะ และไม่เป็นอันตราย ไม่ต้องตกใจหยุดยา (หลีกเลี่ยงการใส่คอนแทคเลนส์ชนิดนิ่มเพราะอาจติดสีถาวร)
              </p>
            </div>

            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-2">
              <h4 className="font-black text-teal-950 text-sm flex items-center gap-1.5">
                <span>2. การรับประทานยาตอนท้องว่าง (Empty Stomach)</span>
              </h4>
              <p className="text-teal-900 leading-relaxed font-medium">
                Isoniazid และ Rifampicin ดูดซึมได้ดีที่สุดเมื่อ <strong>ท้องว่าง (ก่อนอาหาร 1 ชม. หรือหลังอาหาร 2 ชม.)</strong> แนะนำทานตอนตื่นนอนเช้าทันที หากมีอาการคลื่นไส้ แน่นท้องรุนแรง อาจปรับให้ทานพร้อมอาหารมื้อเบาๆ หรือย้ายมาทานก่อนนอนได้
              </p>
            </div>

            <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-2">
              <h4 className="font-black text-rose-950 text-sm flex items-center gap-1.5">
                <span>3. อาการเตือนตับอักเสบ (Hepatotoxicity Warning Signs)</span>
              </h4>
              <p className="text-rose-900 leading-relaxed font-medium">
                หากมีอาการ <strong>เบื่ออาหาร คลื่นไส้อาเจียนรุนแรง ตาเหลือง ตัวเหลือง ปวดใต้ชายโครงขวา หรือปัสสาวะสีชาแก่ผิดปกติ</strong> ให้ <strong>"หยุดยาทันที"</strong> แล้วรีบมาพบแพทย์/เภสัชกรที่โรงพยาบาล ห้ามทนรับประทานยาต่อเด็ดขาด
              </p>
            </div>

            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-2">
              <h4 className="font-black text-indigo-950 text-sm flex items-center gap-1.5">
                <span>4. อาการมองเห็นผิดปกติและชาปลายประสาท (Vision & Neuropathy)</span>
              </h4>
              <p className="text-indigo-900 leading-relaxed font-medium">
                ยา Ethambutol อาจทำให้ประสาทตาอักเสบ หากมีอาการ <strong>ตามัว หรือมองเห็นสีแดง-เขียวเพี้ยนไป</strong> ให้หยุดยาและรีบมาตรวจ และให้รับประทาน Pyridoxine (Vitamin B6) วันละ 1 เม็ดต่อเนื่องเพื่อป้องกันอาการชาปลายมือปลายเท้า
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
