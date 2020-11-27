window.$ = window.jQuery = require('jquery');
window.Popper = require('popper.js');
require('bootstrap');
require('./variables');

$(() => {
    const toggler = $('#audio-toggler');
    const stopper = $('#audio-stopper');
    const time    = $('#time');
    const dday    = $('#dday');
    const ringInfo = $('.ringInfo');

    const step_group       = $('#step_group');
    const step_sequence    = $('#step_sequence');
    const step_subject     = $('#step_subject');
    const step_description = $('#step_description');

    const add       = $('#additional');

    ringInfo.toggle(0);
    const diff = new Date('2020-12-03').getTime() - new Date().getTime();
    dday.text(Math.floor(diff / (1000 * 60 * 60 * 24)) + 1);

    function getCurrentTimeCode() {
        const date = new Date();
        return String(date.getHours()).padStart(2, "0") + String(date.getMinutes()).padStart(2, "0");
    }

    function getCurrentBlock(code) {
        if (code > timetable[timetable.length - 1].TIME || code < timetable[0].TIME) {
            return false;
        }

        for (let i = 0; i < timetable.length; i++) {
            if (code >= timetable[i].TIME && code < timetable[i+1].TIME) {
                if (timetable[i].USED === undefined) {
                    timetable[i].USED = true;
                    return timetable[i];
                } else {
                    return false;
                }
            }
        }
    }

    function playAudio(block, type) {
        if (block.TIME === '1310') {
            return false;
        }
        let text = '제 ' + block.GROUP + '교시 ' + group_text[block.GROUP.toString() + block.SEQ.toString()] + '영역 ';
        if (block.SEQ !== '1') {
            text += block.SEQ - 1 + '선택 ';
        }
        text += ring_text[block.TYPE] + ' 재생중';
        ringInfo.text(text);
        ringInfo.fadeToggle(300, 'swing');
        const audio = new Audio('/public/sounds/' + type + '/' + block.TIME + '.mp3');
        audio.play().then(() => {
            setTimeout(() => {
                ringInfo.fadeToggle(300, 'swing');
            }, (audio.duration + 1) * 1000);
        });
    }

    function setTimeString() {
        time.text(new Date().toLocaleTimeString());
    }

    function setStepString(block) {
        step_group.attr('hidden', false);
        step_subject.attr('hidden', false);
        step_group.text('제 ' + block.GROUP + '교시');
        step_subject.text(group_text[block.GROUP.toString() + block.SEQ.toString()] + '영역 ');
        step_description.text(step_text[block.TYPE]);
        if (block.SEQ !== '1') {
            step_sequence.text(block.SEQ - 1 + '선택');
            step_sequence.attr('hidden', false);
        } else {
            step_sequence.attr('hidden', true);
        }
    }

    function isNowFifthTime(block) {
        return block.GROUP === '5';

    }

    function isTakingFifthTime() {
        return !!add.is(':checked');
    }

    setInterval(() => {
        setTimeString();
    }, 200);

    toggler.on('click', () => {
        setInterval(() => {
            const code = getCurrentTimeCode();
            const block = getCurrentBlock(code);
            const soundType = $('#sound_type').val();

            if (!block) {
                step_description.text('시험 진행 시간이 아닙니다 / FAQ 참조');
                step_description.addClass('text-danger font-weight-bold');
            } else {
                setStepString(block);
                if (isNowFifthTime(block) && isTakingFifthTime()) {
                    playAudio(block, soundType);
                }
                if (!isNowFifthTime(block)) {
                    if (block.TIME === '1632') {
                        block.TIME = '1632A';
                        if (isTakingFifthTime()) {
                            block.TIME = '1632B';
                        }
                    }
                    playAudio(block, soundType);
                }
            }
        }, 1000);

        toggler.attr('disabled', true);
        stopper.attr('disabled', false);
    })
})