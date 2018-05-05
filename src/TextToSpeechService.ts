// Put this in its own service?
export function getSpeechSynthesis(): any {
	if (!window.speechSynthesis) {
		// If speechSynthesis API is unavailable, use an object with noop methods.
		return {
			getVoices: () => [],
			speak: () => undefined
		};
	}
	return window.speechSynthesis;
};

// Put this in its own service?
export function speakJapanese(japaneseText: string) {
	const msg = new SpeechSynthesisUtterance(japaneseText);
	const speechSynthesis = getSpeechSynthesis();
	// Get a japanese voice
	msg.voice = speechSynthesis.getVoices().filter((v: any) => v.lang === 'ja-JP')[0];
	speechSynthesis.speak(msg);
};
