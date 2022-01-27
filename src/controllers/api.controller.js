const vanillaPuppeteer = require('puppeteer');
const { addExtra } = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
const { QueryHandler } = require('query-selector-shadow-dom/plugins/puppeteer');

const puppetterUtils = require('../utils/puppeteer.utils');

const shareYouTubeVideos = async (req, res) => {
    const { email, videoTitle } = req.body;
    if (!email || !videoTitle)
        return res.status(400).send({
            status: 400,
            statusText: 'Bad Request',
            message: 'User must enter an email address and video title.',
        });

    await vanillaPuppeteer.registerCustomQueryHandler('shadow', QueryHandler);
    const puppeteer = addExtra(vanillaPuppeteer);
    puppeteer.use(stealthPlugin());
    const browser = await puppeteer.launch({ headless: false });

    try {
        const page = await browser.newPage();

        await puppetterUtils.loginToYouTubeAccount(browser, page);
        await page.waitForTimeout(2500);

        const videoSearchResult = await puppetterUtils.videoSearch(browser, page, videoTitle);
        if (videoSearchResult.type === 'NOT_FOUND')
            return res.send({
                status: 200,
                statusText: 'Ok',
                message: 'No videos were found.',
            });
        await page.waitForTimeout(2500);

        await puppetterUtils.shareVideosToEmail(browser, page);

        await page.waitForTimeout(5000);

        res.send({ status: 200, statusText: 'Ok', message: 'Successfully shared the videos.' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: 500, statusText: 'Internal Server Error', message: '' });
    } finally {
        await browser.close();
    }
};

const unshareYouTubeVideos = async (req, res) => {};

module.exports = {
    shareYouTubeVideos,
    unshareYouTubeVideos,
};
