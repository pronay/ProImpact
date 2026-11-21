import React, { useState } from 'react';
import { MessageSquare, PhoneCall, CheckCircle2, AlertTriangle, Send, QrCode } from 'lucide-react';

export default function WhatsAppSimulator({ roadId = 'RD0058', roadName = 'Sion-Dharavi Link Road', wardCode = 'G/N', contractorName = 'Konkan Roadcon', underDlp = 'Y' }) {
  const [lang, setLang] = useState('mr'); // 'mr', 'hi', 'en'
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState(null);

  const getMessageContent = () => {
    if (lang === 'mr') {
      return {
        header: '🏛️ मुंबई रस्ता तपासणी (BMC Road Info)',
        roadText: `रस्ता: ${roadName} (${roadId})`,
        wardText: `वॉर्ड: ${wardCode} | कंत्राटदार: ${contractorName}`,
        warrantyText: underDlp === 'Y' ? '⚠️ हमी (DLP): मे २०२६ पर्यंत मोफत दुरुस्ती लागू.' : 'हमी: सामान्य देखभाल.',
        questionText: 'हा रस्ता सध्या व्यवस्थित आहे की खड्डा पडला आहे?',
        yesBtn: 'होय, खड्डा पडला आहे! (Broken)',
        noBtn: 'नाही, व्यवस्थित आहे (Smooth)'
      };
    } else if (lang === 'hi') {
      return {
        header: '🏛️ बीएमसी सड़क सत्यापन (BMC Road Info)',
        roadText: `सड़क: ${roadName} (${roadId})`,
        wardText: `वार्ड: ${wardCode} | ठेकेदार: ${contractorName}`,
        warrantyText: underDlp === 'Y' ? '⚠️ वारंटी (DLP): मई २०२६ तक ठेकेदार मरम्मत के लिए जिम्मेदार।' : 'वारंटी: सामान्य रख-रखाव।',
        questionText: 'क्या इस सड़क पर गड्ढा दोबारा बन गया है?',
        yesBtn: 'हाँ, गड्ढा है! (Broken)',
        noBtn: 'नहीं, सड़क ठीक है (Smooth)'
      };
    } else {
      return {
        header: '🏛️ BMC Civic Road Passport (UNESCO Olavula Standard)',
        roadText: `Road Asset: ${roadName} (${roadId})`,
        wardText: `Ward: ${wardCode} | Contractor: ${contractorName}`,
        warrantyText: underDlp === 'Y' ? '⚠️ Warranty (DLP): Active until May 2026 (Free repairs).' : 'Warranty: Standard maintenance.',
        questionText: 'Is this road segment currently broken or potholed?',
        yesBtn: 'Yes, Pothole Relapsed!',
        noBtn: 'No, Road is Smooth'
      };
    }
  };

  const content = getMessageContent();

  const handleVote = (status) => {
    setFeedbackStatus(status);
    setFeedbackSent(true);
  };

  return (
    <div className="nb-card p-4 bg-white border border-slate-200/90 space-y-3">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#25D366] text-white flex items-center justify-center font-bold">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="nb-badge nb-badge-black text-[9px]">UNESCO LOW-TECH STANDARD</span>
              <span className="text-[10px] font-mono font-bold text-gray-500">Olavula Vernacular Inclusion</span>
            </div>
            <h4 className="font-extrabold text-xs uppercase text-black">
              WhatsApp / SMS Signboard Scanner
            </h4>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono text-gray-500 font-bold">Lang:</span>
          {['mr', 'hi', 'en'].map(l => (
            <button
              key={l}
              onClick={() => { setLang(l); setFeedbackSent(false); }}
              className={`nb-badge text-[10px] uppercase cursor-pointer ${
                lang === l ? 'nb-badge-black text-white' : 'nb-badge-gray'
              }`}
            >
              {l === 'mr' ? 'मराठी' : l === 'hi' ? 'हिंदी' : 'EN'}
            </button>
          ))}
        </div>
      </div>

      <div className="text-[11px] font-mono text-gray-600">
        Simulates what a commuter or auto-driver sees after scanning the QR on a roadside work signboard or texting <strong>{roadId}</strong> to <strong>+91 98200-BMC25</strong>:
      </div>

      {/* Simulated WhatsApp Phone Bubble */}
      <div className="bg-[#EFEAE2] border border-slate-200/80 p-3 rounded-lg shadow-nb-sm max-w-md mx-auto space-y-2.5 font-sans">
        {/* Incoming Bot Message */}
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-300 space-y-1.5 text-xs text-gray-800">
          <div className="font-bold text-[#075E54] flex items-center gap-1 text-[11px]">
            <span>{content.header}</span>
          </div>
          <div className="font-bold text-sm text-black">{content.roadText}</div>
          <div className="text-gray-700 font-medium">{content.wardText}</div>
          <div className="text-red-700 font-bold text-[11px] bg-red-50 p-1.5 rounded border border-red-200">{content.warrantyText}</div>
          <div className="pt-1 text-gray-900 font-extrabold border-t border-gray-200">{content.questionText}</div>
        </div>

        {/* 1-Tap Feedback Buttons */}
        {!feedbackSent ? (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleVote('broken')}
              className="bg-white border border-slate-200/80 hover:bg-[#FF4757] hover:text-white p-2 rounded-lg font-bold text-center transition-all text-xs shadow-sm"
            >
              🚨 {content.yesBtn}
            </button>
            <button
              onClick={() => handleVote('smooth')}
              className="bg-white border border-slate-200/80 hover:bg-[#00E599] hover:text-black p-2 rounded-lg font-bold text-center transition-all text-xs shadow-sm"
            >
              ✓ {content.noBtn}
            </button>
          </div>
        ) : (
          <div className="bg-green-100 border border-green-500 p-2.5 rounded text-center text-xs text-green-900 font-bold space-y-1">
            <div className="flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-700" />
              <span>प्रतिक्रिया नोंदवली! Feedback Recorded!</span>
            </div>
            <p className="text-[10px] text-green-800 font-normal">
              Your field verification for {roadId} was logged into the live durability proxy without requiring any app download.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
