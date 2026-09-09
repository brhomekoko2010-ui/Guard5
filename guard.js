const bedrock = require('bedrock-protocol');
const axios = require('axios');

const client = bedrock.createClient({
  host: 'gold.magmanode.com',   // آبي سيرفر البيدروك
  port: 28055,              // بورت البيدروك الافتراضي
  username: 'GuardBot',     // اسم البوت في السيرفر
  offline: true             // إذا كان السيرفر لا يتطلب تسجيل xbox رسمي
});

client.on('join', () => {
  console.log('Guard دخل سيرفر البيدروك بنجاح وجاهز!');
});

// الاستماع للشات والتفاعل بالذكاء الاصطناعي
client.on('text', async (packet) => {
  // تصفية رسائل اللاعبين فقط
  if (packet.source_name === client.username || !packet.message) return;

  const username = packet.source_name;
  const message = packet.message;

  try {
    const systemPrompt = `أنت Guard، حارس سرفر ماينكرافت بيدروك. 
    شخصيتك: حارس عراقي صارم ومضحك، تحب المزاح مع اللاعبين.
    اللاعب ${username} قال: "${message}".
    اجب بـ جملة واحدة قصيرة ومضحكة باللهجة العراقية.`;

    const response = await axios.get(`https://text.pollinations.ai/${encodeURIComponent(systemPrompt)}`);
    
    if (response.data) {
      const reply = response.data.trim();
      // إرسال الرد في شات السيرفر
      client.queue('text', {
        type: 'chat',
        needs_translation: false,
        source_name: client.username,
        xuid: '',
        platform_chat_id: '',
        message: `[Guard]: ${reply}`
      });
    }
  } catch (err) {
    // خطأ بالاتصال
  }
});

client.on('error', (err) => {
  console.log('خطأ في الاتصال:', err);
});
 
