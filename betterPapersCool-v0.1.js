// ==UserScript==
// @name         Better Papers Cool
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds cross-links between arXiv.org and papers.cool for easier navigation.
// @author       SunnyYYLin
// @match        https://arxiv.org/abs/*
// @match        https://papers.cool/arxiv/*
// @grant        GM_xmlhttpRequest
// @connect      arxiv.org
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Handles the click event on the [BibTex] button.
     * Fetches BibTeX data from arXiv, copies it to the clipboard, and provides user feedback.
     * @param {Event} event - The click event object.
     * @param {string} arxivId - The arXiv ID of the paper.
     */
    function handleBibtexCopyClick(event, arxivId) {
        event.preventDefault(); // 阻止链接默认跳转

        const bibtexButtonElement = event.currentTarget; // 获取被点击的按钮元素
        const originalText = bibtexButtonElement.textContent;
        const bibtexUrl = `https://arxiv.org/bibtex/${arxivId}`;

        // 改变按钮文字，提供即时反馈
        bibtexButtonElement.textContent = '[Fetching...]';

        // 使用 GM_xmlhttpRequest 执行跨域请求
        GM_xmlhttpRequest({
            method: 'GET',
            url: bibtexUrl,
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    const bibtexText = response.responseText;
                    navigator.clipboard.writeText(bibtexText).then(() => {
                        bibtexButtonElement.textContent = '[Copied!]';
                        setTimeout(() => {
                            bibtexButtonElement.textContent = originalText;
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy BibTeX: ', err);
                        alert('复制失败，请检查浏览器权限。');
                        bibtexButtonElement.textContent = originalText; // 失败时恢复
                    });
                } else {
                    console.error('Error fetching BibTeX, status:', response.status);
                    alert('获取 BibTeX 数据失败 (服务器状态码: ' + response.status + ')。');
                    bibtexButtonElement.textContent = originalText; // 失败时恢复
                }
            },
            onerror: function(error) {
                console.error('Error fetching BibTeX:', error);
                alert('获取 BibTeX 数据失败 (网络错误)。');
                bibtexButtonElement.textContent = originalText; // 失败时恢复
            }
        });
    }

    /**
     * This function runs on arxiv.org pages.
     * It finds the ArXiv ID and adds a link to the corresponding papers.cool page.
     */
    function enhanceArxivPage() {
        const fullTextDiv = document.querySelector('div.full-text');
        if (!fullTextDiv) {
            console.log('Enhancer Script: Could not find full-text div on arXiv.');
            return;
        }

        let list = fullTextDiv.querySelector('ul');
        if (!list) {
            console.log('Enhancer Script: Could not find link list on arXiv.');
            return;
        }

        const match = window.location.pathname.match(/\/abs\/(.+)/);
        if (!match || !match[1]) {
            console.log('Enhancer Script: Could not parse arXiv ID from URL.');
            return;
        }
        const arxivId = match[1];

        const papersCoolLink = document.createElement('a');
        papersCoolLink.textContent = 'Papers Cool';
        papersCoolLink.href = `https://papers.cool/arxiv/${arxivId}`;
        papersCoolLink.target = '_blank';
        papersCoolLink.rel = 'noopener noreferrer';
        papersCoolLink.className = 'abs-button';
        papersCoolLink.title = 'View on papers.cool';

        const listItem = document.createElement('li');
        listItem.appendChild(papersCoolLink);
        list.appendChild(listItem);
    }

    /**
     * This function runs on papers.cool pages.
     * It finds the link back to ArXiv and adds new links for BibTeX and direct PDF access.
     */
    function enhancePapersCoolPage() {
        const paperCards = document.querySelectorAll('.panel.paper');

        paperCards.forEach(card => {
            const arxivId = card.id;
            if (!arxivId) {
                return;
            }

            const titleHeader = card.querySelector('h2.title');
            if (!titleHeader) {
                console.warn(`Could not find title header for paper ${arxivId}.`);
                return;
            }

            const arxivButton = document.createElement('a');
            arxivButton.textContent = '[arXiv]';
            arxivButton.href = `https://arxiv.org/abs/${arxivId}`;
            arxivButton.target = '_blank';
            arxivButton.title = 'View on arXiv';
            arxivButton.className = 'title-rel notranslate';
            arxivButton.style.marginLeft = '3px';

            const bibtexButton = document.createElement('a');
            bibtexButton.textContent = '[BibTex]';
            bibtexButton.href = '#';
            bibtexButton.title = 'Copy BibTeX citation';
            bibtexButton.className = 'title-rel notranslate';
            bibtexButton.style.marginLeft = '3px';

            // Attach the event listener, calling the separated handler function.
            bibtexButton.addEventListener('click', (event) => {
                handleBibtexCopyClick(event, arxivId);
            });

            titleHeader.append(' ', arxivButton, ' ', bibtexButton, ' ');
        });
    }

    /**
     * Main execution block.
     */
    function run() {
        const hostname = window.location.hostname;

        if (hostname.includes('arxiv.org')) {
            enhanceArxivPage();
            console.log('Enhancer Script: Running on arXiv.org');
        } else if (hostname.includes('papers.cool')) {
            enhancePapersCoolPage();
            console.log('Enhancer Script: Running on papers.cool');
        } else {
            console.log('Enhancer Script: Not on arXiv.org or papers.cool, no action taken.');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();
