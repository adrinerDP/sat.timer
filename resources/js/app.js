window.$ = window.jQuery = require('jquery');

const step_text = {
    PRE_ENTER: '입실준비',
    ENTER: '입실',
    PRE_START: '예비령',
    READY: '준비령',
    START: '본령',
    PRE_END: '종료예고',
    END: '종료령',
};

const group_text = {
    1: '국어',
    2: '수학',
    3: '영어',
    4: '탐구',
    5: '제2외국어·한문',
}

const timetable = [
    {
      "TIME": "0805",
      "GROUP": "1",
      "SEQ": "1",
      "TYPE": "PRE_ENTER"
    },
    {
      "TIME": "0810",
      "GROUP": "1",
      "SEQ": "1",
      "TYPE": "ENTER"
    },
    {
      "TIME": "0825",
      "GROUP": "1",
      "SEQ": "1",
      "TYPE": "PRE_START"
    },
    {
      "TIME": "0835",
      "GROUP": "1",
      "SEQ": "1",
      "TYPE": "READY"
    },
    {
      "TIME": "0840",
      "GROUP": "1",
      "SEQ": "1",
      "TYPE": "START"
    },
    {
      "TIME": "0950",
      "GROUP": "1",
      "SEQ": "1",
      "TYPE": "PRE_END"
    },
    {
      "TIME": "1000",
      "GROUP": "1",
      "SEQ": "1",
      "TYPE": "END"
    },
    {
      "TIME": "1015",
      "GROUP": "2",
      "SEQ": "1",
      "TYPE": "ENTER"
    },
    {
      "TIME": "1020",
      "GROUP": "2",
      "SEQ": "1",
      "TYPE": "PRE_START"
    },
    {
      "TIME": "1025",
      "GROUP": "2",
      "SEQ": "1",
      "TYPE": "READY"
    },
    {
      "TIME": "1030",
      "GROUP": "2",
      "SEQ": "1",
      "TYPE": "START"
    },
    {
      "TIME": "1200",
      "GROUP": "2",
      "SEQ": "1",
      "TYPE": "PRE_END"
    },
    {
      "TIME": "1210",
      "GROUP": "2",
      "SEQ": "1",
      "TYPE": "END"
    },
    {
      "TIME": "1255",
      "GROUP": "3",
      "SEQ": "1",
      "TYPE": "ENTER"
    },
    {
      "TIME": "1300",
      "GROUP": "3",
      "SEQ": "1",
      "TYPE": "PRE_START"
    },
    {
      "TIME": "1305",
      "GROUP": "3",
      "SEQ": "1",
      "TYPE": "READY"
    },
    {
      "TIME": "1310",
      "GROUP": "3",
      "SEQ": "1",
      "TYPE": "START"
    },
    {
      "TIME": "1410",
      "GROUP": "3",
      "SEQ": "1",
      "TYPE": "PRE_END"
    },
    {
      "TIME": "1420",
      "GROUP": "3",
      "SEQ": "1",
      "TYPE": "END"
    },
    {
      "TIME": "1435",
      "GROUP": "4",
      "SEQ": "1",
      "TYPE": "ENTER"
    },
    {
      "TIME": "1440",
      "GROUP": "4",
      "SEQ": "1",
      "TYPE": "PRE_START"
    },
    {
      "TIME": "1445",
      "GROUP": "4",
      "SEQ": "1",
      "TYPE": "READY"
    },
    {
      "TIME": "1450",
      "GROUP": "4",
      "SEQ": "1",
      "TYPE": "START"
    },
    {
      "TIME": "1515",
      "GROUP": "4",
      "SEQ": "1",
      "TYPE": "PRE_END"
    },
    {
      "TIME": "1520",
      "GROUP": "4",
      "SEQ": "1",
      "TYPE": "END"
    },
    {
      "TIME": "1525",
      "GROUP": "4",
      "SEQ": "2",
      "TYPE": "READY"
    },
    {
      "TIME": "1530",
      "GROUP": "4",
      "SEQ": "2",
      "TYPE": "START"
    },
    {
      "TIME": "1555",
      "GROUP": "4",
      "SEQ": "2",
      "TYPE": "PRE_END"
    },
    {
      "TIME": "1600",
      "GROUP": "4",
      "SEQ": "2",
      "TYPE": "END"
    },
    {
      "TIME": "1602",
      "GROUP": "4",
      "SEQ": "3",
      "TYPE": "START"
    },
    {
      "TIME": "1627",
      "GROUP": "4",
      "SEQ": "3",
      "TYPE": "PRE_END"
    },
    {
      "TIME": "1632",
      "GROUP": "4",
      "SEQ": "3",
      "TYPE": "END"
    },
    {
      "TIME": "1645",
      "GROUP": "5",
      "SEQ": "1",
      "TYPE": "ENTER"
    },
    {
      "TIME": "1650",
      "GROUP": "5",
      "SEQ": "1",
      "TYPE": "PRE_START"
    },
    {
      "TIME": "1655",
      "GROUP": "5",
      "SEQ": "1",
      "TYPE": "READY"
    },
    {
      "TIME": "1700",
      "GROUP": "5",
      "SEQ": "1",
      "TYPE": "START"
    },
    {
      "TIME": "1730",
      "GROUP": "5",
      "SEQ": "1",
      "TYPE": "PRE_END"
    },
    {
      "TIME": "1740",
      "GROUP": "5",
      "SEQ": "1",
      "TYPE": "END"
    }
  ];

$(() => {
    const toggler = $('#audio-toggler');
    const time    = $('#time');
    const step    = $('#step');
    const melody  = $('#melody');
    const add     = $('#additional');

    function getCurrentTimeCode() {
        const date = new Date();
        let currentTimeKey =  String(date.getHours()).padStart(2, "0") + String(date.getMinutes()).padStart(2, "0")
        return currentTimeKey;
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

    function playAudio(type, code) {
        const audio = new Audio('/public/media/' + type + '/' + code + '.mp3');
        audio.play();
    }

    function setTimeString() {
        time.text(new Date().toLocaleTimeString());
    }

    function setStepString(block) {
        step.text('제 ' + block.GROUP + '교시 ' + group_text[block.GROUP] + '영역 ' + step_text[block.TYPE]);
    }

    function processTrack(code) {
        if (melody.is(':checked')) {
            playAudio('melody', code);
        } else {
            playAudio('normal', code);
        }
    }

    setInterval(() => {
        setTimeString();
    }, 200);

    toggler.on('click', () => {
        setInterval(() => {
            const code = getCurrentTimeCode();
            const block = getCurrentBlock(code);
            if (block !== false) {
                setStepString(block);
                if (block.GROUP === 5 && add.is(':checked')) {
                    processTrack(block.TIME);
                }
                if (block.GROUP !== 5) {
                    processTrack(block.TIME);
                }
            }
        }, 1000);
        toggler.addClass('btn-light');
        toggler.text('안내방송이 진행중입니다');
        toggler.attr('disabled', true);
    })
})