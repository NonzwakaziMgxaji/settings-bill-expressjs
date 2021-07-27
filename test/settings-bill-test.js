let assert = require("assert");
let SettingsBill = require("../settings-bill");

describe('settings-bill', function(){
    let settingsBill = SettingsBill();

    it('should be able to set the settings', function(){
        settingsBill.setSettings({
            smsCost: 2,
            callCost: 4,
            warningLevel: 20,
            criticalLevel: 40
        });

        assert.deepEqual({
            smsCost: 2,
            callCost: 4,
            warningLevel: 20,
            criticalLevel: 40
        }, settingsBill.getSettings())
    });


    it('should be able to record the number of calls made', function(){
        settingsBill.recordAction('call');
        settingsBill.recordAction('call');
        settingsBill.recordAction('call');
        assert.equal(3, settingsBill.actionsFor('call').length);
    });

    it('should be able to record the number of smses sent', function(){
        settingsBill.recordAction('sms');
        settingsBill.recordAction('sms');
        assert.equal(2, settingsBill.actionsFor('sms').length);
    });


    it('should use the values set for call and sms, and calculate the right totals', function(){
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 2,
            callCost: 4,
            warningLevel: 20,
            criticalLevel: 40
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');
        settingsBill.recordAction('sms');

        assert.equal(8.00, settingsBill.totals().callTotal);
        assert.equal(4.00, settingsBill.totals().smsTotal);
        assert.equal(12.00, settingsBill.totals().grandTotal);

    });

    it('should know when warning level reached', function(){
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 2,
            callCost: 4,
            warningLevel: 20,
            criticalLevel: 40
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal(false, settingsBill.hasReachedWarningLevel());
    });

    it('should know when critical level reached', function(){
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 5,
            callCost: 10,
            warningLevel: 20,
            criticalLevel: 40
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');
        settingsBill.recordAction('sms');
        settingsBill.recordAction('sms');
        settingsBill.recordAction('sms');

        assert.equal(true, settingsBill.hasReachedCriticalLevel());

    });
});